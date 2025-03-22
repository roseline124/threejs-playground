export const vertexShader = `
out vec2 v_uv;
void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
in vec2 v_uv;
uniform float uTime;

void main() {
    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 blue = vec3(0.0, 0.0, 1.0);

    float endPoint = 2.0;
    float speed = 0.5;
    float localTime = uTime * speed + (endPoint - v_uv.x);  // 위치별 시간 오프셋
    float t = mod(localTime, endPoint);  // 0~2 반복

    if (t > 1.0) {
        t = endPoint - t;  // 뒤집기 (왕복)
    }

    vec3 mixedColor = mix(red, blue, t);

    gl_FragColor = vec4(mixedColor, 1.0);
}
`;
