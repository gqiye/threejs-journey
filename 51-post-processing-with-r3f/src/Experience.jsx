import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { SSR ,DepthOfField,Bloom ,Noise, Glitch, Vignette, EffectComposer} from '@react-three/postprocessing'
import { GlitchMode,BlendFunction } from 'postprocessing'
import {useControls} from 'leva'
import Drunk from "./Drunk"
import { useRef } from 'react'

export default function Experience()
{
    const drunkRef = useRef();
    // const props = useControls({
    //     temporalResolve: true,
    //     STRETCH_MISSED_RAYS: true,
    //     USE_MRT: true,
    //     USE_NORMALMAP: true,
    //     USE_ROUGHNESSMAP: true,
    //     ENABLE_JITTERING: true,
    //     ENABLE_BLUR: true,
    //     temporalResolveMix: { value: 0.9, min: 0, max: 1 },
    //     temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
    //     maxSamples: { value: 0, min: 0, max: 1 },
    //     resolutionScale: { value: 1, min: 0, max: 1 },
    //     blurMix: { value: 0.5, min: 0, max: 1 },
    //     blurKernelSize: { value: 8, min: 0, max: 8 },
    //     blurSharpness: { value: 0.5, min: 0, max: 1 },
    //     rayStep: { value: 0.3, min: 0, max: 1 },
    //     intensity: { value: 1, min: 0, max: 5 },
    //     maxRoughness: { value: 0.1, min: 0, max: 1 },
    //     jitter: { value: 0.7, min: 0, max: 5 },
    //     jitterSpread: { value: 0.45, min: 0, max: 1 },
    //     jitterRough: { value: 0.1, min: 0, max: 1 },
    //     roughnessFadeOut: { value: 1, min: 0, max: 1 },
    //     rayFadeOut: { value: 0, min: 0, max: 1 },
    //     MAX_STEPS: { value: 20, min: 0, max: 20 },
    //     NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
    //     maxDepthDifference: { value: 3, min: 0, max: 10 },
    //     maxDepth: { value: 1, min: 0, max: 1 },
    //     thickness: { value: 10, min: 0, max: 10 },
    //     ior: { value: 1.45, min: 0, max: 2 }
    //   })

    const drunkProps = useControls('Drunk Effect',{
        frequecy:{value:2,min:1,max:20},
        amplitude:{value:0.1,min:0,max:1}
    })
    return <>

        <color args={['#ffffff']} attach="background" />
        {/* 效果器 */}
        {/* <EffectComposer 
            // 默认为8 抗锯齿
            // multisampling={8}
             > */}
                {/* 边缘昏暗效果 */}
                {/* <Vignette offset={0.3} darkness={0.9}
                // NORMAL 默认 混合颜色报错 COLOR_BURN
                 blendFunction={ BlendFunction.NORMAL}
                /> */}
                {/* 故障效果 */}
                {/* <Glitch
                    delay={[0.5,1]}
                    duration={[0.1,0.3]}
                    strength={[0.2,0.4]}
                    // mode={GlitchMode.CONSTANT_MILD}
                /> */}
                {/* 噪点
                    blendFunction 
                    OVERLAY
                    SCREEN
                    SOFT_LIGHT
                    AVERAGE
                */}
                {/* <Noise
                    // 乘法以色调
                    premultiply
                    blendFunction={BlendFunction.SOFT_LIGHT}
                /> */}
                {/* 发光 
                    需要配合物料颜色,需要rgb超过1{[红,绿,蓝]}
                    并且加上 toneMapped={false} 
                    参数 mipmapBlur ,发光强度变大
                    亮度取决于照射光和物料的值大小
                */}
                {/* <Bloom mipmapBlur 
                intensity={0.5} 
                // 在什么程度进行发光 
                luminanceSmoothing={0}/> */}
                {/* 景深 
                值为0-1 需要计算获取物体位置进行聚焦
                    focusDistance 焦距
                    focalLength  到焦距之前的最大模糊值
                    bokehScale  焦点角度
                */}
                {/* <DepthOfField 
                    focusDistance={0.025}
                    focalLength={0.025}
                    bokehScale={6}
                /> */}
                {/* 空间反射
                    计算进行发射,性能影响大
!!!!!!=!报错,未能解决
                */}
                {/* <SSR {...props}/> */}
               
        {/* </EffectComposer> */}
        {/* 为什么这个会影响颜色,之前不会呀 */}
        <EffectComposer>
            <Drunk
                ref={ drunkRef }
                {...drunkProps}
                // 混合颜色,原本的和提供的颜色进混合
                blendFunction={BlendFunction.DARKEN}
            />
        </EffectComposer>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <mesh castShadow position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
            {/* //面向光的一侧会异常亮 */}
            {/* <meshStandardMaterial 
                // color={[1.5,1,4]} 
                color={'white'} 
                // 发光颜色
                // emissive={'orange'}
                // 强度
                // emissiveIntensity={2}
                // toneMapped={false} 
            /> */}
            {/* 基础材料避免光影响 */}
            {/* <meshBasicMaterial
                color={[1.5,1,4]} 
                toneMapped={false} 
            /> */}
        </mesh>

        <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial 
                // 需要看到反射的
                color='#15fdde'
                // metalness={0}
                // roughness={0}
            />
        </mesh>

    </>
}