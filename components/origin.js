AFRAME.registerComponent('origin', {
    schema: {
        camera: { type: 'selector', default: null }, // child camera (auto if null)
        height: { type: 'number', default: 1.6 },    // camera Y offset when not in XR
        showBounds: { type: 'boolean', default: true },
        boundsColor: { type: 'color', default: '#00ffff' },
        boundsWidth: { type: 'number', default: 0.02 },   // rendered line width (mesh tube)
        boundsY: { type: 'number', default: 0.01 },   // slight lift to avoid z-fighting
        recenterOnEnterXR: { type: 'boolean', default: false }
    },

    init() {
        this._line = null;
        this._boundsSpace = null;
        this._onEnterXR = this._onEnterXR.bind(this);
        this._onExitXR = this._onExitXR.bind(this);
        this._ensureCamera();
        this._applyDesktopHeight();

        const xr = this.el.sceneEl.renderer && this.el.sceneEl.renderer.xr;
        if (xr) {
            xr.addEventListener('sessionstart', this._onEnterXR);
            xr.addEventListener('sessionend', this._onExitXR);
            if (xr.isPresenting) this._onEnterXR(); // already in XR
        }
    },

    update() { this._ensureCamera(); },

    remove() {
        const xr = this.el.sceneEl.renderer && this.el.sceneEl.renderer.xr;
        if (xr) {
            xr.removeEventListener('sessionstart', this._onEnterXR);
            xr.removeEventListener('sessionend', this._onExitXR);
        }
        this._disposeLine();
    },

    recenter() {
        // Zero rig pose without touching child camera local transform
        this.el.object3D.position.set(0, 0, 0);
        this.el.object3D.rotation.set(0, 0, 0);
        this.el.emit('originrecentred', {});
    },

    // --- XR hooks ---
    async _onEnterXR() {
        if (!this.data.showBounds) return;
        const xr = this.el.sceneEl.renderer.xr;
        const session = xr.getSession && xr.getSession();
        if (!session) return;

        // Try to request a bounded-floor reference space
        try {
            const bounded = await session.requestReferenceSpace('bounded-floor');
            this._boundsSpace = bounded;
            this._buildBoundsFrom(bounded);
            if (this.data.recenterOnEnterXR) this.recenter();
            this.el.emit('originboundsloaded', {});
        } catch (e) {
            // bounded-floor not available; nothing to draw
        }
    },

    _onExitXR() {
        this._disposeLine();
        this._applyDesktopHeight();
    },

    // --- helpers ---
    _ensureCamera() {
        if (this.data.camera) { this._camEl = this.data.camera; return; }
        const s = this.el.sceneEl;
        this._camEl = s && (s.querySelector('[camera]') || s.querySelector('a-camera')) || null;
        if (this._camEl && this._camEl.parentEl !== this.el) this.el.appendChild(this._camEl);
    },

    _applyDesktopHeight() {
        // In non-XR, keep a reasonable eye height.
        if (this.el.sceneEl.is('vr-mode')) return;
        if (this._camEl) this._camEl.object3D.position.y = this.data.height;
    },

    _buildBoundsFrom(refSpace) {
        const pts = refSpace && refSpace.boundsGeometry ? refSpace.boundsGeometry : null;
        if (!pts || !pts.length) return;

        // Convert DOMPointReadOnly[] to Vector3[]; y≈0 for bounded-floor
        const v = pts.map(p => new THREE.Vector3(p.x, this.data.boundsY, p.z));
        if (v.length > 1) v.push(v[0].clone()); // close loop

        // Build a thin tube for consistent width
        const path = new THREE.CatmullRomCurve3(v, true);
        const tubularSegments = Math.max(32, v.length * 8);
        const geom = new THREE.TubeGeometry(path, tubularSegments, this.data.boundsWidth, 8, true);
        const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(this.data.boundsColor) });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.renderOrder = 999;

        this._disposeLine();
        this._line = mesh;
        this.el.object3D.add(mesh);
    },

    _disposeLine() {
        if (!this._line) return;
        this.el.object3D.remove(this._line);
        this._line.geometry.dispose();
        this._line.material.dispose();
        this._line = null;
    }
});
