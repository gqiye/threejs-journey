// useThree 获取Three里面的元素
// extend 将three的类转化为声明式版本</>
// useFrame 每一帧都调用,动画函数
import {useThree,extend, useFrame } from "@react-three/fiber"
// 绑定指定元素的函数
import { useRef } from "react"
// 轨道控制
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import CustomObject from './CustomObject.jsx'

// console.log(OrbitControls)
// 改为声明式,就是组件形式能使用注意用小写
extend({OrbitControls})

export default function Experience()
{
    // camera  透视相机
    // gl webGLRenderer 的dom元素 
    const {camera,gl} = useThree();
    const cubeRef = useRef();
    const groupRef = useRef();
    // 参数 state three里面的属性
    // delte 帧速度(可以让不同帧率的电脑以同样的速度进行)
    useFrame((state,delta)=>
    {
        // console.log('tick')
        // cubeRef.current 是mesh
        cubeRef.current.rotation.y += delta
        // groupRef.current.rotation.y += delta
        // 时间经过 state.clock.elapsedTime
        
        // 镜头看着中心旋转
        // const angle = state.clock.elapsedTime;
        // state.camera.position.x = Math.sin(angle)*8;
        // state.camera.position.z = Math.cos(angle)*8;
        // state.camera.lookAt(0,0,0)
    }
    )

    return <>
            {/* 轨道控制 注意这里是小写开头*/}
            <orbitControls args={[camera ,gl.domElement]}/>

            {/* 灯光 */}
            <directionalLight position={[1,2,3]} intensity={1.5}/>
            <ambientLight intensity={0.5}/>
            {/* 都用数字不然有意外bug可能
                scale={[x,y,z]} scale={1.5} 修改时候可能无法实时更新
                position={[x,y,z]} position-x={2}
                rotation-y={Math.PI*0.25}
            */}
            <group ref={groupRef}>
            <mesh position-x={-2} >
                {/* args 参数(radius,widthSegments,heightSegments) */}
                <sphereGeometry />
                {/* 写法一 args={[{color:'red'}]} 
                    写法二 color='red' wireframe={true}
                */}
                <meshStandardMaterial color='red'/>
            </mesh>

            <mesh ref={cubeRef} rotation-y={Math.PI*0.25} position-x={2} scale={1.5}>
                <boxGeometry scale={1.5}/>
                <meshStandardMaterial color={'orange'}/>
            </mesh>
            </group>
            <mesh rotation-x={-Math.PI*0.5} position-y={-1} scale={10}>
                <planeGeometry scale={1.5}></planeGeometry>
                <meshBasicMaterial color={"mediumpurple"}></meshBasicMaterial>
            </mesh>

            <CustomObject/>
            </>
}