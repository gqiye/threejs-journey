uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // spin 旋转 
    //  atan函数 https://thebookofshaders.com/glossary/?search=atan
    float angle = atan(modelPosition.x,modelPosition.z);
    // 距离中见位置
    float distanceToCenter = length(modelPosition.xz);
    // 外面移动速度比里面移动慢
    float angleOffset = (1.0 / distanceToCenter) * uTime *0.2;
    // 粒子偏移角度
    angle +=angleOffset;
    // 改变位置
    modelPosition.x = cos(angle)*distanceToCenter;
    modelPosition.z = sin(angle)*distanceToCenter;

    //aRandomnes
    modelPosition.xyz += aRandomness;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    
    
    // size 
    gl_PointSize = uSize * aScale ;
    // 在shaderLib中找到的point_cert.glsl.js中的代码
    // 在不同屏幕大小例子会根据屏幕大小实行适配
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor =color;

}
