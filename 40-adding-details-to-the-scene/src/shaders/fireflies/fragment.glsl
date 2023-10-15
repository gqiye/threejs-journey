void main(){
    // 距离中心扩散亮度
    // gl_PointCoord vec2 粒子的紫外坐标 uv坐标,可以直接访问 
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    // 反比例函数,,分母x越大,y越小
    // 0.05 *2.0 去除边框 
    float strength = 0.05 / distanceToCenter - 0.05 *2.0 ;

    
    // vec4 参数为 R,G,B,S
    gl_FragColor = vec4(1.0,1.0,1.0,strength);
}