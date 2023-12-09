// Integra Diaz-Trinidad
precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vTexels;

// todo #3 - receive texture coordinates and verify correctness by 
// using them to set the pixel color 

void main(void) {
    // todo #5
    vec3 t2d = texture2D(uTexture, vTexels, uAlpha).rgb;
    gl_FragColor = vec4(t2d, t2d[2]);
    // todo #3
    //gl_FragColor = vec4(vTexels, 0.0, uAlpha);
}

// EOF 00100001-10
