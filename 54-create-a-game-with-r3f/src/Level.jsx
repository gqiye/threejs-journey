import * as THREE from 'three'
import { CuboidCollider ,RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float,Text,useGLTF } from '@react-three/drei'


// 颜色变化,three的颜色管理有关
THREE.ColorManagement.enabled = true
// THREE.ColorManagement.legacyMode = false
// HREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150.

// 优化性能只渲染一个几何体和物料
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floor1Material = new THREE.MeshStandardMaterial({ color: '#111111', metalness:0,roughness:0})
const floor2Material = new THREE.MeshStandardMaterial({ color: '#222222' , metalness:0,roughness:0})
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: '#ff0000', metalness:0,roughness:1 })
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#887777' , metalness:0,roughness:0})



/**
 * 开始出发模块
 * @param {*} param0 
 * @returns 
 */
function BlockStart({ position = [0, 0, 0] }) {
    return <group position={position}>
        <Float
            floatIntensity={0.5}
            rotationIntensity={0.5}
        >
            <Text
                // font
                 scale={0.5}
                 maxWidth={0.25}
                 lineHeight={0.75}
                 textAlign='right'
                 position={[0.72,0.65,0]}
                 rotation-y = {-0.25}
                  >
                    start
                    <meshBasicMaterial toneMapped={false}/>
                    </Text>
        </Float>
        {/*  */}
        <mesh
            geometry={boxGeometry}
            position={[0, -0.1, 0]}
            material={floor1Material}
            scale={[4, 0.2, 4]}
            receiveShadow>
            {/* 使用统一的几何体 scale调整大小 <boxGeometry args={[4,0.2,4]}/> */}
            {/* <meshStandardMaterial color={'limegreen'}/> */}
        </mesh>
    </group>
}
/**
 * 结束模块
 * @param {*} param0 
 * @returns 
 */
function BlockEnd({ position = [0, 0, 0] }) {
    const hamburger = useGLTF('./hamburger.glb')
    // 模型捕获阴影
    // 圆形会自己投影在自己身上,解决方案之前有
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })

    return <group position={position}>
        {/*  */}
        <Text
        scale={1}
        position={[0,1,2]}    
            >
            FINISH
        </Text>
        <mesh
            geometry={boxGeometry}
            position={[0, 0, 0]}
            material={floor1Material}
            scale={[4, 0.2, 4]}
            receiveShadow>
        </mesh>
        <RigidBody
            type='fixed'
            colliders="hull"
            restitution={0.2}
            friction={0}
            position={[0, 0.25, 0]}
        >
            <primitive object={hamburger.scene} scale={0.2}></primitive>
        </RigidBody>
    </group>
}
/**
 * 旋转模块
 * @param {*} param0 
 * @returns 
 */
export function BlockSpinner({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        // console.log(time)
        // 旋转
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            position={[0, -0.1, 0]}
            material={floor2Material}
            scale={[4, 0.2, 4]}
            receiveShadow></mesh>
        <RigidBody
            ref={obstacle}
            position={[0, 0.3, 0]}
            type='kinematicPosition'
            // // 弹跳力 
            restitution={0.2}
            // 摩擦力
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                position={[0, 0.3, 0]}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
                receiveShadow

            />
        </RigidBody>
    </group>
}
/**
 * y轴平移模块
 * @param {*} param0 
 * @returns 
 */
export function BlockLimbo({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15
        // 水平移动
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: y, z: position[2] })

    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            position={[0, -0.1, 0]}
            material={floor2Material}
            scale={[4, 0.2, 4]}
            receiveShadow></mesh>
        <RigidBody
            ref={obstacle}
            position={[0, 0.3, 0]}
            type='kinematicPosition'
            // // 弹跳力 
            restitution={0.2}
            // 摩擦力
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                position={[0, 0.3, 0]}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
                receiveShadow

            />
        </RigidBody>
    </group>
}
/**
 * x轴平移模块
 * @param {*} param0 
 * @returns 
 */
export function BlockAxe({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const x = Math.sin(time + timeOffset) * 1.25
        // 水平移动
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.5, z: position[2] })

    })

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            position={[0, -0.1, 0]}
            material={floor2Material}
            scale={[4, 0.2, 4]}
            receiveShadow></mesh>
        <RigidBody
            ref={obstacle}
            position={[0, 0.3, 0]}
            type='kinematicPosition'
            // // 弹跳力 
            restitution={0.2}
            // 摩擦力
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                position={[0, 0.3, 0]}
                material={obstacleMaterial}
                scale={[1.5, 1.5, 0.3]}
                castShadow
                receiveShadow

            />
        </RigidBody>
    </group>
}

// 墙壁
function Bounds({ length = 1 }) {
    return <>
        <RigidBody type='fixed' restitution={0.2} friction={0}>
            <mesh
                position={[2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                castShadow
            >
            </mesh>

            <mesh
                position={[-2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                receiveShadow
            >
            </mesh>

            <mesh
                position={[0, 0.75, -(length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                receiveShadow
            >
            </mesh>
            {/* 地板物理 */}
            <CuboidCollider 
                args={[2,0.1,2*length]}
                position={[0,-0.1,-(length*2)+2]}
                restitution={0.2}
                friction={1}
                />
        </RigidBody>
    </>
}

export function Level({ count = 5, types = [BlockSpinner, BlockLimbo, BlockAxe],seed =0}) {
    const blocks = useMemo(() => {
        const blocks = []
        for (let i = 0; i < count; i++) {

            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)

        }
        return blocks
    }, [count, types ,seed])

    return <>
        <BlockStart position={[0, 0, 0]} />
        {
            blocks.map((Black, index) => <Black key={index} position={[0, 0, -(index + 1) * 4]} />)
        }
        <BlockEnd position={[0, 0, -(count + 1) * 4]} />
        <Bounds length={count + 2} />
    </>
}