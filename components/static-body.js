AFRAME.registerComponent('static-body', {
    schema: {
        type: { default: 'plane' }, // 'plane' only in this minimal demo
        normal: { type: 'string', default: '0 1 0' },
        offset: { type: 'number', default: 0 } // y of plane
    }
});