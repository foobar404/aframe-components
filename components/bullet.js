AFRAME.registerSystem("bullet", {
    init: function () {
        var e;
        (e = document.createElement("a-entity")).id = "superShooterBulletContainer", this.el.sceneEl.appendChild(e), this.container = e.object3D, this.pool = {}, this.targets = []
    },
    registerBullet: function (e) {
        var t, i, n, l;
        if (l = e.el.object3D)
            for (i = e.data, this.pool[i.name] = [], n = 0; n < i.poolSize; n++)(t = l.clone()).damagePoints = i.damagePoints, t.direction = new THREE.Vector3(0, 0, -1), t.maxTime = 1e3 * i.maxTime, t.name = i.name + n, t.speed = i.speed, t.time = 0, t.visible = !1, this.pool[i.name].push(t)
    },
    registerTarget: function (e, t) {
        var i;
        this.targets.push(e.el), t && ((i = e.el.object3D).boundingBox = (new THREE.Box3).setFromObject(i))
    },
    shoot: function (e, t) {
        var i, n = 0,
            l = 0,
            o = this.pool[e];
        if (void 0 === o) return null;
        for (i = 0; i < o.length; i++) {
            if (!1 === o[i].visible) return this.shootBullet(o[i], t);
            o[i].time > l && (n = i, l = o[i].time)
        }
        return this.shootBullet(o[n], t)
    },
    shootBullet: function (e, t) {
        return e.visible = !0, e.time = 0, t.getWorldPosition(e.position), t.getWorldDirection(e.direction), e.direction.multiplyScalar(-e.speed), this.container.add(e), e
    },
    tick: function () {
        var e = new THREE.Box3,
            t = new THREE.Vector3,
            i = new THREE.Box3;
        return function (n, l) {
            var o, r, s, a, u;
            for (r = 0; r < this.container.children.length; r++)
                if ((o = this.container.children[r]).visible)
                    if (o.time += l, o.time >= o.maxTime) this.killBullet(o);
                    else
                        for (t.copy(o.direction).multiplyScalar(l / 850), o.position.add(t), e.setFromObject(o), u = 0; u < this.targets.length; u++) {
                            let t = this.targets[u];
                            if (t.getAttribute("target").active && ((a = t.object3D).visible && (s = !1, a.boundingBox ? s = a.boundingBox.intersectsBox(e) : (i.setFromObject(a), s = i.intersectsBox(e)), s))) {
                                this.killBullet(o), t.components.target.onBulletHit(o), t.emit("hit", null);
                                break
                            }
                        }
        }
    }(),
    killBullet: function (e) {
        e.visible = !1
    }
});

AFRAME.registerComponent("bullet", {
    dependencies: ["material"],
    schema: {
        damagePoints: {
            default: 1,
            type: "float"
        },
        maxTime: {
            default: 4,
            type: "float"
        },
        name: {
            default: "normal",
            type: "string"
        },
        poolSize: {
            default: 10,
            type: "int",
            min: 0
        },
        speed: {
            default: 8,
            type: "float"
        }
    },
    init: function () {
        var e = this.el;
        e.object3D.visible = !1, e.addEventListener("object3dset", t => {
            e.sceneEl.systems.bullet.registerBullet(this)
        })
    }
})