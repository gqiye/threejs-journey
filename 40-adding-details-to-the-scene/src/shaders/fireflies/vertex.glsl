uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main(){
    // modeMatrix 模型矩阵
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    // 点模型的运动
    // sin 函数 上下运动
    // modelPosition.x * 100.0 随机值 频率
    // ascale *0.2大小影响移动速度 振幅
    modelPosition.y +=sin(uTime+ modelPosition.x * 100.0)*aScale*0.2;
    // 视图矩阵 viewMatrix
    vec4 viewPosition = viewMatrix * modelPosition;
    // 项目矩阵 projectionMatrix
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uPixelRatio * uSize * aScale;
    // 根据摄像头远小近大   调整立方体大小
    gl_PointSize *= (1.0/ - viewPosition.z);

}