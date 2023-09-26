// 顶点着色器
// 每个矩阵都将变换position，直到我们得到最终的剪裁空间坐标。
// 3个矩阵，因为它们的值对于几何体的所有顶点都是相同的，所以我们使用uniform检索它们。
// 更多矩阵文档https://learnopengl.com/Getting-started/Coordinate-Systems

// projectionMatrix将我们的坐标转换为最终的剪裁空间坐标。
uniform mat4 projectionMatrix;
// viewMatrix将应用相对于相机的变换。如果我们向左旋转相机，顶点应该在右边。
// 如果我们沿着网格的方向移动相机，顶点会变大，等等
uniform mat4 viewMatrix;
// modelMatrix将应用与网格相关的所有变换。
// 如果我们缩放、旋转或移动网格，这些变换将包含在modelMatrix中并应用于position。
uniform mat4 modelMatrix;


// 属性变量attribute是顶点之间唯一会发生变化的变量。 里面有normal,position,uv
// 相同的顶点着色器将应用于每个顶点，“position”属性将包含该特定顶点的x、y和z坐标。
// 将这个vec3转换成一个vec4，因为矩阵和gl_Position都需要用到这个vec4
attribute vec3 position;
// 几何体上投射纹理的坐标，也就是UV坐标。
// PlaneBufferGeometry会自动生成这些坐标，可以通过打印geometry.attributes.uv看到
attribute vec2 uv;
// h获取js设置的属性
attribute float aRandom;


// 获取js传递的属性
// uniform float uFrequency;
uniform vec2 uFrequency;
//获取js提供的时间
uniform float uTime;



// 将数据从顶点着色器发送到片元着色器
varying float vRandom;
// 需要在片元着色器中使用这些坐标。而要将数据从顶点着色器发送至片元着色器，我们要创建一个名为vUv的变量varying，并在main函数中对其赋值：
varying vec2 vUv;
// 风的高度存储在一个变量
varying float vElevation;

void main(){
    // 变量gl_Position原本就已经声明好，是一个内置变量，我们只需重新分配它
    // 这个变量将会包含屏幕上的顶点的位置，main函数中的代码便是要正确设置该变量。
    // 这条长代码将返回一个vec4，这意味着我们可以直接在gl_Position变量上使用其x、y、z和w属性。
    // 这些坐标并不是精确的位于二维空间，而是位于我们说的需要四个维度的剪裁空间Clip Space
    // 剪裁空间Clip Space是指在-1到+1范围内的所有3个方向（x、y和z）上的空间。这就像把所有东西都放在3D盒子里一样，
    // 任何超出此范围的内容都将被“剪裁”并消失。第四个值（w）负责透视。
    // 我们并没有在3D空间里边移动平面,在2D空间上移动了平面。
    // 要应用矩阵，我们需要将其相乘。如果要将mat4应用于变量，该变量必须是vec4。
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // 平面向上移动
    // modelPosition.y += 1.0;
    // 平面变波浪形
    // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
    // 利用js设置随机值,控制平面的波动
    // modelPosition.z += aRandom * 0.1;
    // 利用js传递的值,控制平面波动
    //  modelPosition.z += sin(modelPosition.x * uFrequency) * 0.1;
    // vec2控制控制水平和垂直方向的波
    // modelPosition.z += sin(modelPosition.x * uFrequency.x) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y) * 0.1;
    // 时间变化更新画面
    //   modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
    // 控制y轴缩放
    // modelPosition.y *=0.5;
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    

    gl_Position = projectedPosition;
    // 写法等价
    // 代码更短但我们对每一步的控制权也就越弱：
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;

    
}