import { SSR ,DepthOfField,Bloom ,Noise, Glitch, Vignette, EffectComposer} from '@react-three/postprocessing'
// npm install @react-three/postprocessing@2.6
export default function Effects(params) {
    return <EffectComposer>
        <SSR
            intensity={0.45}
            exponent={1}
            distance={10}
            fade={20}
            roughnessFade={1}
            thickness={10}
            ior={0.45}
            maxRoughness={1}
            maxDepthDifference={10}
            blend={0.95}
            correction={1}
            correctionRadius={1}
            blur={0}
            blurKernel={1}
            blurSharpness={10}
            jitter={0.75}
            jitterRoughness={0.2}
            steps ={40}
            refineSteps={5}
            missedRay={true}
            useNormalMap={true}
            useRoughnessMap={true}
            resolutionScale={1}
            velocityResolutionScale={1}
        />
        <DepthOfField
            focusDistance={0.01}
            focalLength={0.2}
            bokehScale={3}
        />
    </EffectComposer>
}