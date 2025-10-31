# A-Frame Components

This repo contains small, reusable A-Frame components focused on locomotion, input helpers, and scene utilities. Below is a short summary of each component and its notable schema options.

- **world-grab**: let a controller "grab" and drag the world/rig. Key options: `event` (start), `endEvent`, `speed`, `invert`, `minMove`, `maxMove`.
- **vignette**: screen-space donut/ring overlay parented to the camera. Key options: `color`, `radius`, `innerRadius`, `opacity`, `distance`.
- **fly**: continuous flying locomotion (thumbstick + optional event-driven throttle/vertical). Key options: `speed`, `vSpeed`, `turnSpeed`, `accelerateEvent`, `verticalEvent`, `deadzone`, `cameraRig`.
- **smooth-move**: smooth thumbstick movement (head- or rig-based). Key options: `speed`, `deadzone`, `headBased`, `cameraRig`.
- **smooth-turn**: smooth yaw turning from thumbstick X. Key options: `speedDeg`, `deadzone`, `cameraRig`.
- **snap-turn**: snap yaw turns when stick deflected past a threshold. Key options: `stepDeg`, `threshold`, `resetBand`, `cooldown`, `cameraRig`.
- **jump**: jump impulse + gravity with ground snapping via raycast. Key options: `event`, `impulse`, `gravity`, `terminalVelocity`, `ground`, `groundY`, `snapTol`.
- **wasd-plus**: small helper that adds Q/E keys to move the rig up/down (depends on `wasd-controls`).
- **passthrough-toggle**: toggle environment pass-through by removing/restoring `environment` attribute. Key options: `event`.
- **origin**: XR origin helpers; builds a bounds line from bounded-floor reference space and allows recentering. Key options: `height`, `showBounds`, `recenterOnEnterXR`.
- **haptics**: simple haptic helpers; emit `haptic-pulse`/`haptic-burst` to trigger controller vibration. Key options: `intensity`, `duration`.

# References
- https://github.com/c-frame/aframe-physics-system?tab=readme-ov-file#installation
- https://github.com/fernandojsg/aframe-teleport-controls
- https://github.com/rdub80/aframe-gui
- https://github.com/supermedium/superframe/tree/master/components/state/
- https://github.com/dmarcos/aframe-motion-capture-components
- https://github.com/AdaRoseCannon/aframe-htmlmesh
- https://github.com/harlyq/aframe-sprite-particles-component