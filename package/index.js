#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// destination folder (default = current)
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const templateDir = path.join(__dirname, "template");

// copy template files
await fs.copy(templateDir, targetDir, { overwrite: false });

console.log(`Project created in ${targetDir}`);
