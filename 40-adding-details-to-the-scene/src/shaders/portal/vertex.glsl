varying vec2 vUv;

void main(){
    // modeMatrix 模型矩阵
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    // 视图矩阵 viewMatrix
    vec4 viewPosition = viewMatrix * modelPosition;
    // 项目矩阵 projectionMatrix
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}