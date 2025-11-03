#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const components = [
    "bullet", "confetti", "decal", "fly", "gravity", "haptics",
    "jump", "origin", "passthrough-toggle", "phone-controls",
    "rigid-body", "shooter", "smooth-move", "smooth-turn",
    "snap-turn", "static-body", "super-keyboard", "target",
    "vignette", "wasd-plus", "world-grab"
];

const isAddCommand = process.argv[2] === "add";

if (isAddCommand) {
    await handleAddCommand();
} else {
    await handleCreateProject();
}

async function handleCreateProject() {
    const projectNameArg = process.argv[2];

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "Project name:",
            default: "my-xr-app",
            when: !projectNameArg
        },
        {
            type: "checkbox",
            name: "components",
            message: "Select components:",
            choices: components,
            default: components
        }
    ]);

    const projectName = projectNameArg || answers.projectName;
    const selectedComponents = answers.components;
    const targetDir = path.resolve(projectName);
    const templateDir = path.join(__dirname, "template");
    const componentsDir = path.join(__dirname, "..", "components");

    console.log(`Loading ${selectedComponents.length} components...`);

    await fs.copy(templateDir, targetDir, { overwrite: false });

    const libDir = path.join(targetDir, "src", "lib");
    await fs.ensureDir(libDir);

    await new Promise(resolve => setTimeout(resolve, 500));

    for (const comp of selectedComponents) {
        const srcFile = path.join(componentsDir, `${comp}.js`);
        const destFile = path.join(libDir, `${comp}.js`);
        await fs.copy(srcFile, destFile);
    }

    const indexContent = selectedComponents
        .map(comp => `import './lib/${comp}.js';`)
        .join('\n');

    const indexFile = path.join(targetDir, "src", "index.js");
    const existingContent = await fs.readFile(indexFile, "utf-8").catch(() => "");
    const newContent = existingContent + (existingContent ? "\n" : "") + indexContent;
    await fs.writeFile(indexFile, newContent);

    console.log(`Project created in ${targetDir}`);
}

async function handleAddCommand() {
    const targetDir = process.cwd();
    const componentsToAdd = process.argv.slice(3);

    if (componentsToAdd.length === 0) {
        const answers = await inquirer.prompt([
            {
                type: "checkbox",
                name: "components",
                message: "Select components to add:",
                choices: components
            }
        ]);
        componentsToAdd.push(...answers.components);
    }

    const libDir = path.join(targetDir, "src", "lib");
    const componentsDir = path.join(__dirname, "..", "components");
    await fs.ensureDir(libDir);

    console.log(`Adding ${componentsToAdd.length} components...`);

    for (const comp of componentsToAdd) {
        const srcFile = path.join(componentsDir, `${comp}.js`);
        const destFile = path.join(libDir, `${comp}.js`);
        await fs.copy(srcFile, destFile);
    }

    const indexFile = path.join(targetDir, "src", "index.js");
    let indexContent = await fs.readFile(indexFile, "utf-8");

    for (const comp of componentsToAdd) {
        const importLine = `import './lib/${comp}.js';`;
        if (!indexContent.includes(importLine)) {
            indexContent += `\n${importLine}`;
        }
    }

    await fs.writeFile(indexFile, indexContent);
    console.log(`Added components: ${componentsToAdd.join(", ")}`);
}