import {useMatcapTexture, Center,Text3D, OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useRef,useState,useEffect } from 'react'
// 时间帧函数
import { useFrame } from '@react-three/fiber'
import * as THREE from "three";

// 优化二
const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial();

export default function Experience()
{
    // 访问群组
    const donutsGroup = useRef();
    // 时间函数动画
    useFrame((state,delta)=>{
        // console.log(delta)
        for (const donut of donutsGroup.current.children) {
            
            donut.rotation.y += delta*0.3
            
        }
    })


    // 优化一 简化渲染的几何体,物料
    // const [torusGeometry, setTorusGeometry] = useState();
    // const [material, setMaterial] = useState();
    const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91',1024)

    // 优化二
    useEffect(()=>{
        // three 和r3f 混合需要设置一下颜色
        // 新版本遗弃
        matcapTexture.encoding =THREE.sRGBEncoding;
        // matcapTexture.outputColorSpace = THREE.SRGBColorSpace;
        matcapTexture.needsUpdate = true;

        material.matcap = matcapTexture;
        // 要求材料更新
        material.needsUpdate =true;
        
    },[])
  
    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />
        {/* 优化一 简化渲染的几何体,物料 */}
        {/* <torusGeometry ref={ setTorusGeometry } args={[1,0.6,16,32]}/>
        <meshMatcapMaterial ref={setMaterial} matcap={ matcapTexture } /> */}


        <Center>
            <Text3D 
                material={material}
                font='./fonts/helvetiker_regular.typeface.json'
                size={0.75}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
            >
                HELLO R3F
                {/* 字体不生效 https://github.com/emmelleppi/matcaps/blob/master/PAGE-1.md*/}
                {/* <meshMatcapMaterial matcap={ matcapTexture } /> */}
            </Text3D>
        </Center>
        {/* 新建分组是为了访问组内元素 */}
        <group ref={donutsGroup}>
        {
            [...Array(100)].map((value,index)=> 
            <mesh
                key={ index }
                geometry={ torusGeometry }
                material={material}
                position={
                    [
                        (Math.random()- 0.5 ) *10,
                        (Math.random()- 0.5 ) *10,
                        (Math.random()- 0.5 ) *10
                    ]
                }
                scale={ 0.2 +Math.random()*0.2}
                rotation={
                    [Math.random()* Math.PI,
                    Math.random()* Math.PI,
                    0]
                }
            >
                
                
            </mesh>
            )
        }
        </group>    
    </>
}