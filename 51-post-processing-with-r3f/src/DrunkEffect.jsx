import { Effect,BlendFunction } from "postprocessing";
import { Uniform } from "three";
// import * as THREE from 'three'

        
const fragmentShader = /*glsl */`
        uniform float frequency;
        uniform float amplitude;
        uniform float offset;
        // 处理扭曲
        void mainUv(inout vec2 uv)
        {
            // frequency 振幅 amplitude 频率
            uv.y +=sin(uv.x * frequency + offset) *amplitude;
        }
        // const 常数 in 调用函数不会影响已发送? out 修改的值 uv 随机坐标  inputColor 获取颜色  outputColor 应用颜色效果 
        void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor)
        {
            // vec4 color = inputColor;
            // // rgb 绿色
            // color.rgb *=vec3(0.8,1.0,0.5);
            // outputColor = color;
            // 使用blendFunction
            outputColor = vec4(0.8,1.0,0.5,inputColor.a);
        }
`

export default class DrunkEffect extends Effect{

    constructor({frequecy=0,amplitude=0,blendFunction = BlendFunction.DARKEN}){
        // 效果名,fragment,option
        super(
            'DrunkEffect',
            fragmentShader,
            {
                blendFunction:blendFunction,
                uniforms:new Map([
                    ['frequency',new Uniform(frequecy)],
                    ['amplitude',new Uniform(amplitude)],
                    ['offset', new Uniform(0)]
                ])
            }
        )

    }
    update(renderer,inputBuffer,deltaTime){
        this.uniforms.get('offset').value +=deltaTime
    }
}