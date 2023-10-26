import {Clone,useGLTF} from '@react-three/drei'
// import {useLoader} from '@react-three/fiber'
// import { GLTFLoader } from 'three/examples/jsm/loaders/gltfloader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/dracoloader.js'

export default function Model(){
    // const model = useLoader(GLTFLoader,
    //     './hamburger.glb',
    //     (loader)=>{
    //         const dracoloader = new DRACOLoader();
    //         dracoloader.setDecoderPath('./draco/')
    //         loader.setDRACOLoader(dracoloader)
    //     });
    const model = useGLTF('./hamburger-draco.glb')

    return <>
        <Clone object={model.scene} scale={0.35} position-x={-4} />
        <Clone object={model.scene} scale={0.35} position-x={0} />
        <Clone object={model.scene} scale={0.35} position-x={4}/>
    </>
    //  <primitive object={model.scene} scale={0.35} />
}
// 预加载,相同路径,效果没验证
useGLTF.preload('./hamburger-draco.glb')