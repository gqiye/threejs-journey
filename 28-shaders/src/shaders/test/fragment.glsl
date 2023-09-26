// 片元着色器
// 片元着色器的代码将应用于几何体的每个可见片元(像素)。这就是为什么片元着色器运行在顶点着色器之后

//mediump 决定浮点数的精度
// 参数一 highp：会造成性能影响，并可能在某些设备上无法工作。
// 参数二 mediump：我们通常使用这个。
// 参数三 lowp：会由于缺乏精确性而产生某些错误。
precision mediump float;

// 获取js传入变量
uniform vec3 uColor;
// 获取纹理类型,sampler2D
uniform sampler2D uTexture;

// 片元着色器获取顶点的数据
// varying的一个有趣之处是，顶点之间的值是线性插值的，以此实现平滑渐变。
// 如果GPU正在两个顶点之间绘制一个片元，一个顶点的变量为1.0，另一个顶点的变量为0.0，那么片元值将为0.5。
// 最后重新回归最初的普通平面。
varying float vRandom;
// 获取顶点着色器的uv
varying vec2 vUv;
varying float vElevation;

void main(){
    // 这是一个vec4，前三个值是红色、绿色和蓝色通道（r、g、b），第四个值是alpha（a）
    // gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);
    // gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);

    // vec4 RGBA
    // texture2D(...)的输出值是一个vec4因为它包含rgb和a
    // texture2D()方法，该方法第一个参数就是应用的纹理，
    // 第二个参数是由在纹理上拾取的颜色的坐标组成
    vec4 textureColor = texture2D(uTexture, vUv);
    // 改变textureColor的r,g,b属性 製造一點阴影
    textureColor.rgb *= vElevation * 2.0 + 0.67;
    // 使用紋理
    gl_FragColor = textureColor;
    // 使用顔色
    // gl_FragColor = vec4(uColor, 1.0);
    
}