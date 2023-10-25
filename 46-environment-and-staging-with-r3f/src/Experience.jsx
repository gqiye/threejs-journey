import { useFrame } from '@react-three/fiber'
// AccumulativeShadows 
// 用于平面plane
// 需要取消原本的阴影,要不然重叠 去除 receiveShadow SoftShadows
// 需要包含灯光

// ContactShadows
// 用于平面plane前面
// 物理规则不准确
// 模糊阴影,跟物体距离没有区别
// 如果是移动物体渲染阴影性能会有所影响


// sky 天空
// Environment 环境光环境贴图
// Lightformer 灯光
// Stage 舞台助手
import {Stage,Lightformer ,Environment, Sky, ContactShadows,RandomizedLight, AccumulativeShadows, SoftShadows,BakeShadows,useHelper,OrbitControls} from '@react-three/drei'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import {useControls} from 'leva'


// 这种写法报错
// SoftShadows({
//     frustrum: 3.75, // Frustrum width (default: 3.75)
//     size: 0.005, // World size (default: 0.005)
//     near: 9.5, // Near plane (default: 9.5)
//     samples: 17, // Samples (default: 17)
//     rings: 11, // Rings (default: 11)
//   })


export default function Experience()
{   
    const directionalLight = useRef()
    // 灯光辅助 
    useHelper(directionalLight,THREE.DirectionalLightHelper,1)

    const cube = useRef()
    
    useFrame((state, delta) =>
    {
        const time = state.clock.elapsedTime; 
        cube.current.position.x =2+ Math.sin(time)
        cube.current.rotation.y += delta * 0.2
    })

    const {color,opacity,blur} = useControls('contact shadows',{
        color:'#4b2709',
        opacity:{value:0.4,min:0,max:1},
        blur:{value:2.8,min:0,max:10},
    })
    const {sunPosition} = useControls('sky',{
        sunPosition: {value: [1,2,3] },

    }) 
    const {envMapIntensity,envMapHeight,envMapRadius,envMapScale}= useControls('environment map',{
        envMapIntensity:{value:7,min:0,max:12},
        envMapHeight:{value:7,min:0,max:100},
        envMapRadius:{value:28,min:10,max:1000},
        envMapScale:{value:100,min:10,max:1000},

    })

    return <>
        {/* 環境 
            参数文档 https://github.com/pmndrs/drei/blob/master/src/helpers/environment-assets.ts
        */}
        {/* <Environment 
            // 背景图
            // background
            // 分辨率 用于内部的一些mesh light的图,不会影响环境图
            // resolution={32}
            preset='sunset'
            // 让平面接近环境的地板
            // 几何图形调整一下高度position-y={1} 
            ground = {
                {
                    height:envMapHeight,
                    radius:envMapRadius,
                    scale:envMapScale
                }
            }
            // files={[
            //     './environmentMaps/2/px.jpg',
            //     './environmentMaps/2/nx.jpg',
            //     './environmentMaps/2/py.jpg',
            //     './environmentMaps/2/ny.jpg',
            //     './environmentMaps/2/pz.jpg',
            //     './environmentMaps/2/nz.jpg',
            // ]}
            // 有更加現實的光
            // https://polyhaven.com/hdris
            files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
        > */}
            {/* 设置背景环境颜色 */}
            {/* <color args={['black']} attach="background"></color> */}
            {/* 反射光照 
                应用案例 https://codesandbox.io/s/lwo219?file=%2Fsrc%2FApp.js%3A917-1016
            */}
            {/* <Lightformer
            position-z={-5}
             scale={10}
             color={'red'}
             intensity={10}
             form={'ring'}
             ></Lightformer> */}
            {/* mesh平面反射设置光亮 */}
            {/* <mesh position-z={-5} scale={10}>
                <planeGeometry/>
                <meshBasicMaterial color={[10,0,0]}/>
            </mesh> */}
        {/* </Environment> */}


        {/* 烘焙渲染,只会在渲染一次,减少性能使用 */}
        {/* <BakeShadows/> */}
        {/* <SoftShadows
        frustrum={3.75}
         size={ 0.005 }
         samples= { 17 }
         rings ={11}
        /> */}
        {/* <color args={['#fff000']} attach='background'/> */}
         
        <Perf position="top-left" />

        <OrbitControls makeDefault />

        {/* <AccumulativeShadows 
        position={[0,-0.99,0]}
        scale={10}
        // 灯光颜色
        color='#316d39'
        opacity={0.8}
        //需要渲染多次次
        // ios可能会冻结
        frames={Infinity}
        // 慢慢渲染  1000/帧数 解决一时间太多帧数渲染问题
        temporal
        // 多少帧重新渲染,快速移动的阴影少
        blend={100}
        >
            //  随机光
            //     amount 灯光个数
            //     radius 抖动幅度
            //     intensity 光强度 
            //     ambient 无影灯?缝隙的阴影
            //     castShadow  阴影
            //     bias 偏移
            //     mapsize 阴影地图大小 
            //     size 
            //     near
            //     far
              
            <RandomizedLight
            amount={8}
            radius={1}
            ambient={0.5}
            intensity={1}
            bias={0.001}
            position={[1,2,3]}
            ></RandomizedLight>
        </AccumulativeShadows> */}

        {/* 投影 */}
        {/* <ContactShadows 
        position={[0,0,0]}
         scale={10}
         resolution={512}
         far={5}
         color={color}
         opacity={opacity}
        //  模糊
         blur={blur}
        //  渲染帧率,数量渲染完结束,不再渲染
        frames={1}
         /> */}
        {/* 點燈 */}
        {/* <directionalLight
         ref={directionalLight} 
         //  跟太陽光位置一致，陰影才會更真實
         position={ sunPosition }
         intensity={ 1.5 } 
         castShadow
         shadow-mapSize={[1024,1024]}
         shadow-camera-near={1}
         shadow-camera-far={10}
         shadow-camera-top={5}
         shadow-camera-right={5}
         shadow-camera-bottom={-5}
         shadow-camera-left={-5}
         /> */}
        {/* <ambientLight intensity={ 0.5 } /> */}
        {/* sky 天空
        https://threejs.org/examples/webgl_shaders_sky.html
            sunPosition 陽光位置
        */}
        {/* <Sky
            sunPosition={sunPosition}
        /> */}

        {/* <mesh castShadow position-y={1} position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity}/>
        </mesh>

        <mesh castShadow position-y={1}  ref={ cube } position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity}/>
        </mesh> */}

        {/* <mesh position-y={ 0 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" envMapIntensity={envMapIntensity}/>
        </mesh> */}
        {/*Stage文档 https://github.com/pmndrs/drei#staging */}
        <Stage
            ContactShadows={
                {
                    opacity:0.2,
                    blur:3
                }
            }
            environment={'sunset'}
            preset={'portrait'}
            intensity={2}
        >
        <mesh castShadow position-y={1} position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" envMapIntensity={envMapIntensity}/>
        </mesh>

        <mesh castShadow position-y={1}  ref={ cube } position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity}/>
        </mesh>
        </Stage>
    </>
}