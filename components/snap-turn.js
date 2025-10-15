AFRAME.registerComponent('snap-turn', {
    schema: {
        stepDeg: { type: 'number', default: 30 },      // degrees per snap
        threshold: { type: 'number', default: 0.6 },     // stick deflection to trigger
        resetBand: { type: 'number', default: 0.2 },     // must return inside to re-arm
        cooldown: { type: 'int', default: 180 },     // ms between snaps
        cameraRig: { type: 'selector', default: null }
    },
    init() {
        this.x = 0; this.armed = true; this.lastSnap = 0;
        this._onThumb = e => { this.x = e.detail.x || 0; };
        this._onAxis = e => { const a = e.detail.axis || e.detail.axes || []; if (a.length) this.x = a[0]; };
        this._resolveRig();
        this.el.addEventListener('thumbstickmoved', this._onThumb);
        this.el.addEventListener('axismove', this._onAxis);
    },
    update() { this._resolveRig(); },
    remove() {
        this.el.removeEventListener('thumbstickmoved', this._onThumb);
        this.el.removeEventListener('axismove', this._onAxis);
    },
    tick(t) {
        if (!this.rig) return;
        const now = t || performance.now();
        if (this.armed && Math.abs(this.x) >= this.data.threshold && now - this.lastSnap >= this.data.cooldown) {
            const dir = this.x > 0 ? 1 : -1;
            // invert direction
            const yawRad = (this.data.stepDeg * -dir) * Math.PI / 180;
            this.rig.object3D.rotation.y += yawRad;
            this.lastSnap = now; this.armed = false;
            this.el.emit('snapturn', { dir, stepDeg: this.data.stepDeg });
        }
        if (!this.armed && Math.abs(this.x) <= this.data.resetBand) this.armed = true;
    },
    _resolveRig() {
        if (this.data.cameraRig) { this.rig = this.data.cameraRig; return; }
        const s = this.el.sceneEl, cam = s && (s.querySelector('[camera]') || s.querySelector('a-camera'));
        this.rig = cam ? cam.parentEl : null;
    }
});
