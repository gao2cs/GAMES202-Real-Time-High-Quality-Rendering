class PRTMaterial extends Material {

    constructor( vertexShader, fragmentShader) {
        super({
            'uPrecomputeLR': { type: 'blank', value: null },
            'uPrecomputeLG': { type: 'blank', value: null },
            'uPrecomputeLB': { type: 'blank', value: null },
        }, ['aPrecomputeLT'], vertexShader, fragmentShader, null);
    }

}

async function buildPRTMaterial(vertexPath, fragmentPath) {

    let vertexShader = await getShaderString(vertexPath);
    let fragmentShader = await getShaderString(fragmentPath);

    return new PRTMaterial(vertexShader, fragmentShader);
}
