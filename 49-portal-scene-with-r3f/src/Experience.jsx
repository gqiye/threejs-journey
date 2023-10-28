import {shaderMaterial,Sparkles,Center, useTexture ,useGLTF ,OrbitControls } from '@react-three/drei'
import portalVertexShader from './shaders/portal/vertex.js'
import portalFragmentShader from './shaders/portal/fragment.js'
import { useRef } from 'react'
import * as THREE from 'three'
import {useFrame,extend} from '@react-three/fiber'


const PortalMaterial = shaderMaterial({
    uTime:0,
    uColorStart:new THREE.Color('#ffffff'),
    uColorEnd:new THREE.Color('#000000'),
    },
    portalVertexShader,
    portalFragmentShader
)

extend({PortalMaterial})

export default function Experience()
{
    const portalMaterial = useRef()

    const {nodes} = useGLTF('./model/portal.glb');
    const bakedTexture = useTexture('./model/baked.jpg')
    // 注意,如果烘焙图,不能贴正确,让Y轴翻转 map-flipY={false} 或者
    // bakedTexture.flipY =false;
    useFrame((state,delta)=>{
        portalMaterial.current.uTime +=delta;
    })
    return <>

        <color args={['#201919']} attach={'background'}/>
        <OrbitControls makeDefault />
        {/* 模型 */}
        <Center>
            <mesh geometry={nodes.baked.geometry} >
                <meshBasicMaterial map={bakedTexture} map-flipY={false} ></meshBasicMaterial>
            </mesh>
            {/* 灯的mesh */}
            <mesh 
                geometry={nodes.poleLightA.geometry} 
                position={nodes.poleLightA.position}>
                    <meshBasicMaterial color={'#ffffe5'}/>
            </mesh>
            <mesh 
                geometry={nodes.poleLightB.geometry} 
                position={nodes.poleLightB.position}>
                     <meshBasicMaterial color={'#ffffe5'}/>
            </mesh>
            {/* 传送门 */}
            <mesh 
                geometry={nodes.portalLight.geometry} 
                position={nodes.portalLight.position}
                rotation={nodes.portalLight.rotation}
                >
                    <portalMaterial ref={portalMaterial}/>
                    {/* 另一種寫法 */}
                     {/* <shaderMaterial
                        vertexShader={portalVertexShader}
                        fragmentShader={portalFragmentShader}
                        uniforms={
                            {
                                uTime:{value:0},
                                uColorStart:{value:new THREE.Color('#ffffff')},
                                uColorEnd:{value:new THREE.Color('#000000')}
                            }
                        }
                     ></shaderMaterial> */}
            </mesh>
            <Sparkles
                size={6}
                // x,y,z
                scale={[4,2,4]}
                position-y={1}
                speed={0.5}
                count={40}
            />
        </Center>
    </>
}