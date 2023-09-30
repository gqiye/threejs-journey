varying vec3 vColor;

void main()
{   
    // disc 将变为圆形
    // float strength = distance(gl_PointCoord,vec2(0.5));
    // strength = step(0.5,strength);
    // strength = 1.0 -strength;

    // diffuse point 周边虚影圆点
    // 先制作一个中间虚影圆,低于0.5的归零
    // distance(a, b);返回a和b之间的距离
    // 中间黑,到0.5的是时候反而黑的轻,也就是0 - 0.5  0.5 -1
    // float strength = distance(gl_PointCoord,vec2(0.5));
    // // 界限更明显
    // strength *= 2.0;
    // // 倒置变为圆
    // strength = 1.0 -strength;

    // 光点模式 周边更虚
    float strength = distance(gl_PointCoord,vec2(0.5));
    strength = 1.0-strength;
    //  pow  
    strength = pow(strength,10.0);

    // color 
    vec3 color =mix(vec3(0.0),vColor,strength); 

    // gl_PointCoord,
    gl_FragColor = vec4(color, 1.0);
}