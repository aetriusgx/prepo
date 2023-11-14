precision mediump float;

uniform vec3 uLightDirection;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    
    // diffuse contribution
    // todo #1 normalize the light direction and store in a separate variable
    vec3 lightDirNorm = normalize(uLightDirection - vWorldPosition);

    //vec3 aaa = vWorldPosition - lightDirNorm;

    // todo #2 normalize the world normal and store in a separate variable
    vec3 worldNormalNormal = normalize(vWorldNormal);
    // todo #3 calculate the lambert term
    float lambert = max(dot(worldNormalNormal, lightDirNorm), 0.0);

    // specular contribution
    // todo #4 in world space, calculate the direction from the surface point to the eye (normalized)
    vec3 eye = normalize(vec3(vWorldPosition + uCameraPosition));
    // todo #5 in world space, calculate the reflection vector (normalized)
    // L = light dir 
    // N = surface (normalized)
    // 2(l*n)*n - l
    vec3 reflection = normalize(2.0 * dot(uLightDirection, worldNormalNormal) * worldNormalNormal - uLightDirection);

    // todo #6 calculate the phong term
    float phong = abs(pow(max(dot(reflection, eye), 0.0), 64.0));

    // combine
    // todo #7 apply light and material interaction for diffuse value by using the texture color as the material
    vec3 diffuseColor = texture2D(uTexture, vTexcoords).rgb;
    // todo #8 apply light and material interaction for phong, assume phong material color is (0.3, 0.3, 0.3)
    vec3 specularColor = vec3(0.3, 0.3, 0.3) * phong;

    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    vec3 ambient = albedo * 0.1;
    //vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
    // vec3 specularColor = vec3(1.0, 1.0, 1.0);

    // todo #9
    // add "diffuseColor" and "specularColor" when ready
    vec3 finalColor = ambient + diffuseColor + specularColor; // ambient + diffuseColor + specularColor;

    // todo #1?????
    // The instructions say set FragCol to uLightDir
    // But there is no todo in the code



    gl_FragColor = vec4(lambert * finalColor, 1.0);
}

// EOF 00100001-10