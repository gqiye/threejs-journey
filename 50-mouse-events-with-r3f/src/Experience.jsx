import { useFrame } from '@react-three/fiber'
// 精准点击辅助模型可以使用useBVH 
// meshBounds球形边界
import { meshBounds,useGLTF,OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience()
{
    const cube = useRef()
    const hamburger = useGLTF('./hamburger.glb')
    
    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
    })

    const eventHandler =()=>{
        // 点击改变颜色
        // CSS 的 hsl() 和 hsla() 设置颜色 https://blog.csdn.net/weixin_44296929/article/details/102950055
        cube.current.material.color.set(`hsl(${Math.random()*360},100%,75%)`)
    }

    return <>

        <OrbitControls makeDefault />
 
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <mesh position-x={ - 2 } 
              onClick={(event)=>{
                // 阻止事件冒泡?反正就是物体遮挡后,点击事件不会触发到该物体后面的事件
                event.stopPropagation()
              }}
            >
            <sphereGeometry /> 吧  
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh ref={ cube } position-x={ 2 } scale={ 1.5 }
            // 会形成一个圆形的区域边界
            raycast={meshBounds}
            // 点击
            onClick={eventHandler}
            // 上下文菜单,类似右键点击,但是可以在手机打开(长按触发)
            // onContextMenu={eventHandler}
            // 双击
            // onDoubleClick={eventHandler}
            // 点击之后松开生效
            // onPointerUp={eventHandler}
            // 点击就生效
            // onPointerUp={eventHandler}
            // 覆盖生效
            // onPointerOver={eventHandler}
            // useCursor 插件 drei的
            onPointerEnter={()=>{ document.body.style.cursor ='pointer' }}
            // 离开生效
            onPointerLeave={()=>{
                 document.body.style.cursor = 'default'}}
            // onPointerOut={eventHandler}
            // 鼠标移动生效
            // onPointerMove={eventHandler}
            // 物体之外点击生效
            // onPointerMissed={eventHandler}
        
        >
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        <primitive
            object={hamburger.scene}
            scale ={ 0.25 }
            position-y ={ 0.5 }
            onClick={(event)=>{
                // 阻止事件冒泡
                event.stopPropagation()
                console.log(event.object.name)
              }}
        ></primitive>

    </>
}