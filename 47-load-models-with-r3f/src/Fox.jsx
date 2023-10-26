import {useAnimations,useGLTF} from '@react-three/drei'
import { useEffect } from 'react';
import {useControls} from 'leva'

export default function Fox(){

    const fox = useGLTF('./Fox/glTF/Fox.gltf');
    const animations = useAnimations(fox.animations,fox.scene)

    const {animationName } = useControls({
        animationName:{
            options:['Survey','Walk','Run']
        }
    })


    // 第一次渲染之后
    useEffect(()=>{
        const action = animations.actions[animationName]
        // fadeIn 也可以用于过渡
        // reset 重置动作
        action.reset().fadeIn(0.5).play()

        // 过两秒之后换一个动作
        // window.setTimeout(()=>{
        //     animations.actions.Walk.play()
        //     // 动作过渡函数
        //     animations.actions.Walk.crossFadeFrom(animations.actions.Run,1)
        // },2000)

        // 销毁
        return ()=>{
            //淡出
            action.fadeOut(0.5)
            console.log('dispose')
        }

        // 当animationName发生变化的时候,再次调用该函数
    },[animationName])
    
    return <primitive 
                object={fox.scene} 
                scale={0.02}
                position={[-2.5,0,2.5]}
                rotation-y={0.3}
                />
}