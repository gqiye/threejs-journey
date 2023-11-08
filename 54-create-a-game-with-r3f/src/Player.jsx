import { useRapier ,RigidBody } from "@react-three/rapier"
import { useFrame } from "@react-three/fiber"
// 键盘输入触发
import { useKeyboardControls } from "@react-three/drei"
import {useState,useEffect,useRef} from 'react'
import * as THREE from 'three'
import useGame  from "./stores/useGame"
// import * as RAPIER from '@dimforge/rapier3d-compat'


export default function Player(params) {

    const body = useRef();
    const [subscribeKeys,getKeys ]= useKeyboardControls();
    const {rapier,world} = useRapier()
    const rapierWorld = world.raw()


    // 照相机
    const [smoothedCameraPosition] = useState(()=> new THREE.Vector3(10,10,10))
    const [smoothedCameraTarget] = useState(()=> new THREE.Vector3())

    //状态管理
    const start = useGame((state)=>state.start)
    const end = useGame((state)=>state.end)
    const restart = useGame((state)=>state.restart)
    const blocksCount = useGame((state)=>state.blocksCount)

    const jump = ()=>{

        // 无限跳跃解决方法
        const origin = body.current.translation()
        // 这个值? 将圆的原点移动到底部
        origin.y -=0.31
        const direction = {x:0,y:-1,z:0}
        // 射线
        const ray = new rapier.Ray(origin,direction)
        //加上参数解决 撞击点不为 0   参数10,true
        const hit = rapierWorld.castRay(ray,10,true)
        // toi 撞击点的距离/时间 在地板上有值的原因是因为撞击点被误认为在地板底部
        console.log(hit.toi)

        if (hit.toi < 0.15) {
            body.current.applyImpulse({x:0,y:0.5,z:0})
        }
        
    }
    // 重置
    const reset = ()=>{
        body.current.setTranslation({x:0,y:1,z:0})
        body.current.setLinvel({x:0,y:0,z:0})
        body.current.setAngvel({x:0,y:0,z:0})
    }

    // jump触发时候监听
    useEffect(()=>{
        const unsubscribeJump= subscribeKeys(
            // 第一个函数 监听
            (state)=>{
                return state.jump 
            },
            // 选择器 
            (value)=>{
                if (value) {
                    jump()
                }
            }
        )
        // 监听按键
       const unsubscribeAny = subscribeKeys(
            ()=>{
                start()
            }
        ) 

        // 监听状态subscribeWithSelector 的作用
     const unsubscribeReset =   useGame.subscribe(
            (state)=>state.phase,
            (value)=>{
                if (value === 'ready') {
                    reset()
                }
            }
        )


        //热更新造成订阅多次解决
        return ()=>{
            // 销毁
            unsubscribeJump()
            unsubscribeAny()
            unsubscribeReset()
        }
    },[subscribeKeys])

    useFrame((state,delta)=>{
        /**
         * 动作控制
         */
        const {forward,backward,leftward,rightward}= getKeys()  
        // 处理动作 
        // 动力(施加冲量的力)
        const impulse = {x:0,y:0,z:0}
        // 扭矩,旋转(不影响前进的基础上加旋转)
        const torque = {x:0,y:0,z:0}
        // 用力的强度
        const impulseStrength = 1*delta;
        const torqueImpulse = 1*delta;

        // 按下w
        if (forward) {
            // 按下w随时间一直增加往前的力
            impulse.z -= 0.6* impulseStrength
            // 旋转的x轴
            torque.x  -= 0.2 *torqueImpulse
        }
        if (backward) {
            // 按下w随时间一直增加往前的力
            impulse.z += 0.6* impulseStrength
            // 旋转的x轴
            torque.x  += 0.2 *torqueImpulse
        }

        // 按下d
        if (rightward) {
            // 按下w随时间一直增加往前的力
            impulse.x += 0.6* impulseStrength
            // 旋转的x轴
            torque.z  -= 0.2 *torqueImpulse
        }
        if (leftward) {
            // 按下w随时间一直增加往前的力
            impulse.x -= 0.6* impulseStrength
            // 旋转的x轴
            torque.z  += 0.2 *torqueImpulse
        }
       
        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        /**
         * 相机跟随球
         */
        // 位置
        const bodyPosition = body.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z +=2.25
        cameraPosition.y +=0.65
        // 照相机 角度
        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        // 平滑过渡,类似摄影师角度跟随.细节感触没那么大
        smoothedCameraPosition.lerp(cameraPosition,5*delta)
        smoothedCameraTarget.lerp(cameraTarget,5*delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        // 结束标志
        if(bodyPosition.z < -(blocksCount*4+2)){
            end()
        }
        // 倒退掉下去,重启
        if(bodyPosition.y < -4 ){
            restart()
        }
    })
    
    return <RigidBody 
                colliders="ball" 
                position={[0,1,0]}
                restitution={0.2}
                friction={1}
                ref= {body}
                // 线速度
                linearDamping={ 0.5  }
                // 角速度
                angularDamping={0.5}
                >
        <mesh  castShadow>
            <icosahedronGeometry args={[0.3,1]}/>
            <meshStandardMaterial flatShading color={'mediumpurple'} />
        </mesh>
    </RigidBody>

}