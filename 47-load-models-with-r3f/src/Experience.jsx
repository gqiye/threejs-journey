import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
// 懒加载
import { Suspense } from 'react'
import Model from './Model'
import Placeholder from './placeholder'
import Hamburger from './Hamburger'
import Fox from './Fox'

export default function Experience()
{
    // const model = useLoader(GLTFLoader,'./hamburger.glb');
    // 汉堡的draco 加载
    // const model = useLoader(GLTFLoader,
    //     './hamburger.glb',
    //     (loader)=>{
    //         const dracoloader = new DRACOLoader();
    //         dracoloader.setDecoderPath('./draco/')
    //         loader.setDRACOLoader(dracoloader)
    //     });
    // 头盔
    // const model = useLoader(GLTFLoader,
    //     './FlightHelmet/glTF/FlightHelmet.gltf',
    //     (loader)=>{
    //         const dracoloader = new DRACOLoader();
    //         dracoloader.setDecoderPath('./draco/')
    //         loader.setDRACOLoader(dracoloader)
    //     });

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight 
        castShadow position={ [ 1, 2, 3 ] } 
        intensity={ 1.5 } 
        // 解决几何体,接受自己阴影造成波纹ance
        shadow-normalBias={0.04}
        />
        <ambientLight intensity={ 0.5 } />

        <mesh receiveShadow position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        {/* 引入模型使用 primitive*/}
        {/* <primitive object={model.scene} scale={5} position-y={-1}/> */}
        <Suspense
        // fallback 预加载骨架
            fallback={ <Placeholder position-y={0.5} scale={[2,3,2]}/> }
        >
            {/* <Model/>
             */}
             {/* <Hamburger scale={0.35}/> */}
             <Fox></Fox>
        </Suspense>

    </>
}