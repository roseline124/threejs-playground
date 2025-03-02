export const vertexShader = `
varying vec2 v_uv;
void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
precision mediump float;

varying vec2 v_uv;

void main() {
    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);

    float x = v_uv.x;

    vec3 mixedColor = mix(red, blue, x);

    gl_FragColor = vec4(mixedColor, 1.0);
}
`;
