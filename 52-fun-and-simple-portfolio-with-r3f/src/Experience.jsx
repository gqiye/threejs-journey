import {Text,Html,ContactShadows,PresentationControls,Float,Environment,useGLTF, OrbitControls } from '@react-three/drei'
// https://codesandbox.io/s/interactive-spline-scene-live-html-f79ucc
export default function Experience()
{
    const computer = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf')
    
    return <>

        <Environment preset='city'/>

        <color args={['#695b5b']} attach={'background'} />
        {/* 模型控制 */}
        <PresentationControls 
            global
            rotation={[0.13,0.1,0]}
            // 垂直方向可操作范围
            polar={[-0.4,0.2]}
            // 水平方向可操作范围
            azimuth={[-1,0.75]}
            // 操作过渡动画,弹性返回
            config= {{mass:2,tension:400}}
            // 松开鼠标返回原位
            snap={{mass:4,tension:400}}
            >
            <Float rotationIntensity={0.4}>
                <rectAreaLight
                    width={2.5}
                    height={1.65}
                    intensity={100}
                    color={'#ff6900'}
                    rotation = {[0.1,Math.PI,0]}
                    position={[0,0.55,-1.15]}                
                />
                <primitive 
                    object={computer.scene} 
                    position-y ={-1.2}
                >
                    <Html
                    // 旋转
                        transform
                        // 加css
                        wrapperClass='htmlScreen'
                        // 缩小
                        distanceFactor={1.17}
                        position={[0,1.56,-1.4]}
                        rotation-x={-0.256}
                    >
                        <iframe src='https://www.bilibili.com/'></iframe>
                    </Html>
                    <Text 
                        font='./bangers-v20-latin-regular.woff'
                        fontSize={1}
                        position={[2,2,0.75]}
                        rotation-y= {-1.25}
                        children={' qiye\r1101'}
                        // maxWidth={2}
                        textAlign="center"
                    >
                       
                    </Text>
                </primitive>
            </Float>
        </PresentationControls>

        <ContactShadows 
            position-y={-1.4}
            opacity={0.4}
            scale={5}
            blur={2.4}
            ></ContactShadows>
    </>
}