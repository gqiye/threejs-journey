// TransformControls 頁面控制物體移動,鼠标直接操作控制物体的单个操作
// PivotControls 控制物体的所有操作
// html 就是html...
// text SDF字体,各种....效果,具体待研究,文档资料
// float 漂浮效果
// MeshReflectorMaterial  有反射效果的金属板,只适合平板
import {MeshReflectorMaterial,Float,Text, Html,PivotControls, TransformControls, OrbitControls } from "@react-three/drei"
import { useRef } from "react"

/**
 * SDF
 * 函数会知道一个点到几何图形或者线的距离
 */

export default function Experience() {
    const cube = useRef();
    const sphere = useRef();

    return <>
        {/* 移動攝像頭的時候順滑默認true enableDamping={false}  
            makeDefault 解決 與TransformControls在使用的時候不控制攝像頭
        */}
        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />
        {/*  anchor 根据几何的中心位置确认0-1相对值  
            depthTest 是否让不强行显示在物体上面 
            lineWidth 线宽
            axisColors 线颜色
            scale 放大缩小
            fixed 有点固定大小?
            */}
        <PivotControls anchor={[0, 0, 0]} fixed={true} scale={100} depthTest={false} lineWidth={4} axisColors={['#9381ff', '#ff4d6b', '#7ae582']}>
            <mesh ref={sphere} position-x={- 2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                {/* center html元素中心在position位置上 
                    distanceFactor 摄像头原理时候缩小
                    occlude  计算几何体遮挡时候隐藏
                */}
                <Html 
                position={[1,1,0]} 
                wrapperClass="label"
                center
                distanceFactor={3}
                occlude={[sphere,cube]}
                >text123132</Html>
            </mesh>
        </PivotControls>

        {/* TransformControls 使用方法一
        <TransformControls position-x={ 2 }>
        <mesh  scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        </TransformControls> */}

        <mesh ref={cube} position-x={2} scale={1.5}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        {/* TransformControls 使用方法二 
            mode参数  rotate scale  translate
        */}
        <TransformControls object={cube} mode="rotate" />

        <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            {/* <meshStandardMaterial color="greenyellow" />
             */}
             {/* resolution 像素
                blur 模糊(无效果)
                mixBlur 模糊化
                mirror 镜面效果
             */}
             <MeshReflectorMaterial resolution={512} 
             blur={[1000,1000]}
             mixBlur={1}
             mirror={0.5}
             color='greenyellow'
             ></MeshReflectorMaterial>
        </mesh>
        {/* position rotation scale maxWidth={2}*/}
        <Float
            speed={5}
            floatIntensity={2}
        >
        <Text font="./bangers-v20-latin-regular.woff"
            fontSize={1}
            color="salmon"
            position-y={2}
            maxWidth={2}
            textAlign="center"
        >
            i am hero
            {/* <meshNormalMaterial></meshNormalMaterial> */}
        </Text>
        </Float>
    </>
}