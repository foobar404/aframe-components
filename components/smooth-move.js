AFRAME.registerComponent('smooth-move', {
    schema: {
        speed: { type: 'number', default: 3 },     // meters/sec at full deflection
        deadzone: { type: 'number', default: 0.15 },    // ignore tiny stick noise
        cameraRig: { type: 'selector', default: null },  // optional rig selector
        headBased: { type: 'boolean', default: true }    // move by head yaw
    },

    init: function () {
        this.axis = { x: 0, y: 0 };
        this.fwd = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.up = new THREE.Vector3(0, 1, 0);
        this.tmp = new THREE.Vector3();

        this._onThumb = this._onThumb.bind(this);
        this._onAxisMove = this._onAxisMove.bind(this);

        this._resolveRig();
        this._resolveHead();

        this.el.addEventListener('thumbstickmoved', this._onThumb);
        this.el.addEventListener('axismove', this._onAxisMove);
    },

    update: function () {
        this._resolveRig();
        this._resolveHead();
    },

    remove: function () {
        this.el.removeEventListener('thumbstickmoved', this._onThumb);
        this.el.removeEventListener('axismove', this._onAxisMove);
    },

    tick: function (t, dt) {
        if (!this.rig || !this.head) return;
        const secs = dt / 1000;

        let x = Math.abs(this.axis.x) < this.data.deadzone ? 0 : this.axis.x;
        let y = Math.abs(this.axis.y) < this.data.deadzone ? 0 : this.axis.y;
        if (!x && !y) return;

        if (this.data.headBased) {
            this.head.object3D.getWorldDirection(this.fwd);
            this.fwd.y = 0; this.fwd.normalize();
            this.right.crossVectors(this.fwd, this.up).normalize();
        } else {
            this.fwd.set(0, 0, -1);
            this.right.set(1, 0, 0);
            this.fwd.applyQuaternion(this.rig.object3D.quaternion);
            this.right.applyQuaternion(this.rig.object3D.quaternion);
            this.fwd.y = 0; this.right.y = 0;
            this.fwd.normalize(); this.right.normalize();
        }

        // invert left/right and forward/back: negate x and y contributions
        this.tmp.copy(this.right).multiplyScalar(-x)
            .addScaledVector(this.fwd, y)
            .multiplyScalar(this.data.speed * secs);

        this.rig.object3D.position.add(this.tmp);

        this.el.emit('smoothmovestep', { dx: this.tmp.x, dy: this.tmp.y, dz: this.tmp.z });
    },

    _onThumb: function (e) {
        // e.detail.{x,y} in [-1,1]
        this.axis.x = e.detail.x || 0;
        this.axis.y = e.detail.y || 0;
    },

    _onAxisMove: function (e) {
        // fallback for generic axismove: e.detail.axis = [x,y,...]
        const a = e.detail && (e.detail.axis || e.detail.axes || []);
        if (a.length >= 2) { this.axis.x = a[0]; this.axis.y = a[1]; }
    },

    _resolveRig: function () {
        if (this.data.cameraRig) { this.rig = this.data.cameraRig; return; }
        const scene = this.el.sceneEl;
        const cam = scene && (scene.querySelector('[camera]') || scene.querySelector('a-camera'));
        this.rig = cam ? cam.parentEl : null;
    },

    _resolveHead: function () {
        const scene = this.el.sceneEl;
        this.head = scene && (scene.querySelector('[camera]') || scene.querySelector('a-camera')) || null;
    }
});
