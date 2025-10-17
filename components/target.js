AFRAME.registerComponent("target", {
    schema: {
        active: {
            default: !0
        },
        healthPoints: {
            default: 1,
            type: "float"
        },
        static: {
            default: !0
        }
    },
    init: function () {
        var e = this.el;
        e.addEventListener("object3dset", t => {
            e.sceneEl.systems.bullet.registerTarget(this, this.data.static)
        })
    },
    update: function (e) {
        this.healthPoints = this.data.healthPoints
    },
    onBulletHit: function (e) {
        this.data.active && (this.lastBulletHit = e, this.healthPoints -= e.damagePoints, this.healthPoints <= 0 && this.el.emit("die"))
    }
})