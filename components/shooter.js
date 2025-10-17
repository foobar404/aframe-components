AFRAME.registerComponent("shooter", {
    schema: {
        activeBulletType: {
            type: "string",
            default: "normal"
        },
        bulletTypes: {
            type: "array",
            default: ["normal"]
        },
        cycle: {
            default: !1
        }
    },
    init: function () {
        this.el.addEventListener("shoot", this.onShoot.bind(this)), this.el.addEventListener("changebullet", this.onChangeBullet.bind(this)), this.bulletSystem = this.el.sceneEl.systems.bullet
    },
    onShoot: function () {
        this.bulletSystem.shoot(this.data.activeBulletType, this.el.object3D)
    },
    onChangeBullet: function (e) {
        var t, i = this.data,
            n = this.el;
        if ("next" === e.detail) {
            if (-1 === (t = i.bulletTypes.indexOf(i.activeBulletType))) return;
            return t = i.cycle ? (t + 1) % i.bulletTypes.length : Math.min(i.bulletTypes.length - 1, t + 1), i.activeBulletType = i.bulletTypes[t], void n.setAttribute("shooter", "activeBulletType", i.bulletTypes[t])
        }
        if ("prev" === e.detail) {
            if (-1 === (t = i.bulletTypes.indexOf(i.activeBulletType))) return;
            return t = i.cycle ? (t - 1) % i.bulletTypes.length : Math.max(0, t - 1), i.activeBulletType = i.bulletTypes[t], void n.setAttribute("shooter", "activeBulletType", i.bulletTypes[t])
        }
        n.setAttribute("shooter", "activeBulletType", e.detail)
    }
});