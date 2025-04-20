attribute mat3 aPrecomputeLT;

attribute vec3 aVertexPosition;
attribute vec3 aNormalPosition;

varying highp vec3 vColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform mat3 uPrecomputeLR;
uniform mat3 uPrecomputeLG;
uniform mat3 uPrecomputeLB;

float colorFromPrecomputeL(mat3 uPrecomputeL) {
    float color = 0.0;
    for (int i = 0; i < 3; i += 1) {
        color += dot(uPrecomputeL[i], aPrecomputeLT[i]);
    }
    return color;
}

void main(void) {

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix *
            vec4(aVertexPosition, 1.0);

    const float p = 1.0;
    const float PI = 3.1415926;
    float fr = p / PI;
    
    // Do not forget the diffuse BRDF term: fr = p / PI
    vColor[0] = fr * colorFromPrecomputeL(uPrecomputeLR);
    vColor[1] = fr * colorFromPrecomputeL(uPrecomputeLG);
    vColor[2] = fr * colorFromPrecomputeL(uPrecomputeLB);
}