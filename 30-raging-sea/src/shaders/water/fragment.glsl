uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;


varying float vElevation;


void main()
{   
    
    // 混合颜色的程度 百分比混合颜色
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    // 当波浪较低则使用更多uDepthColor，波浪较高则使用更多uSurfaceColor。
    // 为此我们将使用前面学的mix()函数，前俩个参数即为这俩种颜色，
    // 第三个参数将为波浪高度值，根据波浪高度来百分比混合颜色。
     vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}