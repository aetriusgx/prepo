// Integra Diaz-Trinidad
precision mediump float;

uniform vec3 uLightDirection;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {



    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}