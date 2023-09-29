varying vec2 vUv;

// GLSL没有随机数函数
// 固定的随机值
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 旋转uv
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
// 该变量永远不会改变，我们可以在代码开头通过#define进行宏定义：
#define PI 3.1415926535897932384626433832795

// 柏林噪声
//by stefan Gustavson
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}


void main()
{
    // 1.红（R）、绿（G）、蓝（B）
    // gl_FragColor = vec4( vUv.x,vUv.y, 0.0,1.0);

    // 2.黑白渐变效果
    // 0.0.0 黑色 0.5,0.5,0.5灰色 1.1.1 白色 ,渐变

    // 3.只需用vUv的x属性，并且都应用到gl_FragColor的rgb值上边
    // 横向渐变
    // float strength = vUv.x;

    // 4.纵向渐变 
    // float strength = 1.0 -vUv.y;

    // 5.纵向渐变 最后跳跃幅度大
    // float strength = 10.0 *vUv.y;

    // 6.百叶窗 取模 %
    // float strength = mod(10.0 *vUv.y,1.0);

    // 7.y轴斑马线 step(…)函数 一个边缘值作为第一个参数 一个数字作为第二个参数
    // 如果数值小于边缘值，则得到0.0。如果高于边缘值，则得到1.0：
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    //8.交叉斑马线 x轴和y轴二者结合起来
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // 9.交叉点
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // 10.交叉横线
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // 11.x轴上创建横柱，再添加y轴方向上的柱形
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    
    // 12.画十字架交叉  在俩个轴上添加点偏移：
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
    // float strength = barX + barY;


    // 13.中间黑色两边白
    // 首先需要偏移vUv.x使得值为-0.5到0.5，然后再给其取绝对值使得数值范围为0.5到0再到0.5，为此使用abs(...)函数
    // float strength =  abs(vUv.x - 0.5);
    
    // 14.黑色交叉 x轴和y轴二者图案上的最小值，因此使用min(...)函数
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // 15.白色矩形
    // float strength = 1-step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // 白色矩形中间包含黑色矩形
    //     float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    
    // 16.层级渐变  round 有点类似是向上取整么?
    // 将vUv.x乘以10.0，用floor(...)将其向下取整，然后再除以10.0，得到介于0.0到1.0之间的数值：
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // 17.交叉方形
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0;

    // 18.老旧电视画面
    // float strength = random(vUv);

    // 19.马赛克
    // 结合17/18
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);

    // 20.马赛克偏移
    // 要获得倾斜效果，必须在创建gridUv的时候将vUv.x添加到vUv.y
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
    // float strength = random(gridUv);

    // 21.左下角黑其他白
    // 离左下角越远，其值越大也就越亮。而这实际上是vUv的长度。
    // 我们可以使用length(...)得到向量(vec2，vec3或vec4)的长度：
    // float strength = length(vUv);

    // 22.中间黑四周白 
    // float strength = length(vUv-0.5);
    // 要得到vUv到平面中心的距离。平面的UV中心值为0.5，0.5，为此我们要创建一个与中心相对应的vec2二维向量，再通过distance(...)函数获得与vUv的距离：
    // float strength = distance(vUv, vec2(0.5));

    // 23.中间白四周黑 与上面相反
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // 24.灯光效果
    // .一个小值开始，将其除以之前计算的距离.小值决定点的大小
    // float strength = 0.015 / (distance(vUv, vec2(0.5)));

    // 25.灯光变扁
    // 只在y轴方向上进行压缩和移动：
    // 测试案例
    // vec2 lightUv =vec2(
    //     vUv.x*0.2+0.4,
    //     vUv.y*0.5+0.2
    // );
    // float strength = 0.015 / (distance(lightUv, vec2(0.5)));
    // 另一种解法
    // float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));

    // 26.十字光点
    // float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

    // 27.旋转十字光点
    // 中心点旋转vUv坐标。执行2D旋转需要混合sin(...)和cos(...)，在main函数前添加下面这个函数：
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    // strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));

    // 28. 中间圆圈
    // 使用带有distance(...)函数的step(...)函数来控制圆的偏移和其半径：
    // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);


    // 29.中间虚影圆环
    // 使用abs(...)来保存数值为正值：
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // 30 相反圆圈
    // 28+29结合
    // float strength = step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25));

    // 31 圆圈
    // 用1.0 减去上面的值，得到相反图案：
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // 32. 圆环是波浪起伏的。
    // vec2 wavedUv = vec2(
    //     sin(vUv.x),
    //     vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
    
    
    
    // 33.波浪起伏的圆环外围原点
    // vec2 wavedUv = vec2(
    // vUv.x + sin(vUv.y * 30.0) * 0.1,
    // vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // 34.迷幻效果
    // vec2 wavedUv = vec2(
    // vUv.x + sin(vUv.y * 100.0) * 0.1,
    // vUv.y + sin(vUv.x * 100.0) * 0.1
    // );
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // 35.阴影左上向下
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // 36.阴影减半
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;

    // 37.折叠扇
    // atan(...)的返回值介于-π和+π之间，首先除以PI*2：
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // 加上另一半
    // angle += 0.5;
    // float strength = angle;
    // 合并为一行
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;

    // 38.菊花形状
    // 模运算，不过这次是对角度进行使用
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = mod(angle * 20.0, 1.0);

    // 39.菊花形状
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float strength = sin(angle * 100.0);

    // 40.曲形状圆环
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
    // float radius = 0.25 + sin(angle * 100.0) * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // 41.柏林噪声perlin noise
    // 柏林噪声有助于重建如云、水、火、地形等自然形状，但它同时也可以用于设置草或雪在风中移动的动画。
    // 有许多柏林噪声算法具有不同的结果、不同的维度（2D、3D甚至4D），有些算法可以重复，有些算法性能更高等等。
    // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    // float strength = cnoise(vUv* 10.0);
    // 经过step(...)运算
    // float strength = step(0.0, cnoise(vUv * 10.0));
    // 经过1.0减去对噪波进行abs(..)运算得到的
    // 用它来创造闪电、水下反射或等离子能量等类似东西。
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));
    // 对噪波进行sin(...)运算处理：
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);
    // sin(...)和step(...)结合起来：
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));


        // 兼容图案颜色过亮
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));
    // strength = clamp(strength, 0.0, 1.0);
    // 图案11
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    // float strength = barX + barY;
    // strength = clamp(strength, 0.0, 1.0);

    // 图案12
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
    // float strength = barX + barY;
    // strength = clamp(strength, 0.0, 1.0);

    // 混合颜色
    // mix(...)函数，接受三个值：
    // 第一个值可以是浮点型，vec2，vec3或vec4
    // 第二个值应与第一个参数类型一致
    // 第三个值必须是浮点型，以百分比形式混合前俩个值，值可以低于0.0也可以高于1.0并且值会进行外推，值为0返回第一个值，值为1返回第二个值
    // 创建前俩个值：
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    // 根据strength的值来混合俩种颜色：
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    // 混合颜色有个问题
    // mix(...)中使用的strength值超过1.0了，使得输出值外推，超出了函数中接收的第二个值。
    // 要限制该值大小可以对strength使用clamp(...)函数，该函数会设置下限值和上限值：




    gl_FragColor = vec4(mixedColor, 1.0);
}