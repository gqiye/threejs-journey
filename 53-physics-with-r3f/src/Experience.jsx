import { useGLTF,OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
// 多种材料,看文档找对应的进行使用
// RigidBody 刚性物料 在Physics里面添加 里面即使多个几何体也是作为一个整体
// Debug 调试
// CuboidCollider 碰撞体 args参数hx,hy,hz为中心到边缘距离 
// BallCollider 球碰撞体 
// CylinderCollider 圆柱对撞体
// InstancedRigidBodies 使用three的instance然后使用物理碰撞的
import { InstancedRigidBodies,CylinderCollider,BallCollider, Debug, RigidBody, CuboidCollider, Physics } from '@react-three/rapier'
import {useMemo ,useEffect,useState, useRef } from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'


export default function Experience() {

    const [hitSound] = useState(()=> new Audio('./hit.mp3'))
    const twister = useRef()
    const cube = useRef()
    const cubeJump = () => {
        console.log(cube.current)
        // 获取质量
        const mass = cube.current.mass()
        // 往指定方向跳动
        // 5 *mass 质量不影响施加力推动物体的移动
        cube.current.applyImpulse({ x: 0, y: 5 *mass, z: 0 })
        // 往指定方向旋转
        cube.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 })
    }
    useFrame((state)=>{
        const time = state.clock.getElapsedTime()
        
        const eulerRotation = new THREE.Euler(0,time*3,0)
        // 四元数
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)
        // 让长方体旋转
        twister.current.setNextKinematicRotation(quaternionRotation);

        const angle = time *0.5;
        const x = Math.cos(angle)*2
        const z = Math.sin(angle)*2
        twister.current.setNextKinematicTranslation({x:x,y:-0.8,z:z})
        
    })
    // 物体被碰撞时候触发的函数
    const collisionEnter =()=>{
        // 碰撞发出声音,需要用户在碰撞之前点击
        // hitSound.currentTime =0;
        // hitSound.volume =Math.random()
        // hitSound.play()
    }

    const hamburger = useGLTF('./hamburger.glb')
    // 重复多个渲染的图形使用three的,多个会被渲染成单个几何物体
    const cubesCount = 100
    const cubes =useRef()

    const cubeTransforms = useMemo(()=>{
        const positions = []
        const rotations = []
        const scales = []

        for (let i = 0; i < cubesCount; i++) {
            
            positions.push([
                (Math.random()-0.5)*8
                ,(Math.random()-0.5)*2
                ,(Math.random()-0.5)*8])
            rotations.push([0,0,0])
            //不能直接写进去
            const scale = (Math.random()-0.5)*2
            scales.push([scale ,scale ,scale ])
            
        }

        return { positions,rotations,scales}
    },[])


    // useEffect(()=>{
    //     for (let i = 0; i < cubesCount; i++) {
    //         // 四阶矩阵 位置,旋转,缩放组合
    //         const matrix = new THREE.Matrix4()
    //         // compose 是matrix 里面的函数,具体看three
    //         // 参数 position 四元素(旋转) 缩放
    //        let a = matrix.compose(
    //             new THREE.Vector3(i*2,0,0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1,1,1)
    //         )
            
    //         cubes.current.setMatrixAt(i,matrix)
    //         console.log(cubes.current)
            
    //     }
    // },[])

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />
        {/* 默认gravit -9.08 */}
        <Physics gravity={[0, -9.08, 0]}>

            {/* <Debug /> */}

            <RigidBody colliders='ball'>
                <mesh castShadow position={[-1.5, 2, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>
            {/* 一些常规几何碰撞体使用 */}
            {/* <RigidBody 
            // colliders='hull'
            // colliders='trimesh'
            colliders={false}
            position={[0,1,0]} rotation={[Math.PI * 0.5, 0, 0]}
            >
                <BallCollider args={[1.5]}/> */}
            {/* <CuboidCollider args={[1.5,1.5,0.5]}/>
                <CuboidCollider args={[0.25,1,0.25]} position={[0,0,1]} rotation={[Math.PI*0.1,0,0]}/> */}
            {/* <mesh castShadow >
                    <torusGeometry args={[1,0.5,16,32]}/>
                    <meshStandardMaterial color={'mediumpurple'}></meshStandardMaterial>
                </mesh>
            </RigidBody> */}

            <RigidBody ref={cube} 
            position={[1.5, 2, 0]} 
            gravityScale={1} 
            // 弹跳力
            restitution={0}
            // 摩擦力
            friction={0.7}
            // 禁止物体的RigidBody刚体
            colliders = {false}
            >
                <mesh castShadow onClick={cubeJump}>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                <CuboidCollider
                // 质量,不影响掉落速度,真空环境
                 mass={2}
                 args={[0.5,0.5,0.5]}
                 onCollisionEnter={collisionEnter}
                 //  碰撞分开触发
                 onCollisionExit={()=>{console.log('exit')}}
                //  不发生碰撞的时候进行沉睡,减少性能影响
                 onSleep ={()=>{ console.log('sleep')}}
                //  碰撞时候醒触发
                 onWake = {()=>{ console.log('wake') } }
                 />
            </RigidBody>

            <RigidBody type='fixed' friction={0.7} >
                <mesh receiveShadow position-y={- 1.25}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>
            <RigidBody 
                ref={twister}
                position={[0,-0.8,0]} 
                friction={0} 
                // kinematicPosition 移动,不会外力影响,
                type='kinematicPosition'>
                <mesh receiveShadow scale={[0.4,0.4,3]} >
                        <boxGeometry />
                        <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>

            <RigidBody
                // 有bug
                // colliders="hull"
                // 效果最好
                // colliders="trimesh"
                // 取消默认对撞材质
                colliders={false}
                position={[0,4,0]}>
                <primitive object={hamburger.scene} scale={0.25} />
                {/* <CylinderCollider args={[0.5,1.25]}/> */}
            </RigidBody>

            <RigidBody type='fixed'>
                {/* 3d 物理盒子 https://rapier.rs/javascript3d/classes/Cuboid.html */}
                <CuboidCollider args={[5,2,0.5]} position={[0,1,5.5]}></CuboidCollider>
                <CuboidCollider args={[5,2,0.5]} position={[0,1,-5.5]}></CuboidCollider>
                <CuboidCollider args={[0.5,2,5]} position={[5.5,1,0]}></CuboidCollider>
                <CuboidCollider args={[0.5,2,5]} position={[-5.5,1,0]}></CuboidCollider>
            </RigidBody>
            {/* 用three模式写几何体 */}
            <InstancedRigidBodies
                positions={cubeTransforms.positions}
                rotations={cubeTransforms.rotations}
                scales={cubeTransforms.scales}
            >
                <instancedMesh  ref={cubes} castShadow args={[null,null,cubesCount]}>
                    <boxGeometry/>
                    <meshStandardMaterial color={'tomato'}/>
                </instancedMesh>
            </InstancedRigidBodies>
        </Physics>
        
        
    </>
}