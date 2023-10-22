import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import * as THREE from 'three'

const root = ReactDOM.createRoot(document.querySelector('#root'))
const camraSettings = {
    fov: 45,
    near: 0.1,
    far: 200,
    position: [3, 2, 6],
    zoom: 100,
}


root.render(
    <Canvas
    // 像素比,不同机器的像素比不一样,太高的会影响性能
    // dpr={[1,2]}
    // 色彩映射效果 aces(ACESFilmicToneMapping) flat(THREE.CineonToneMapping) //HDR LDR
        gl={{
            // 不需要精细的三维效果，因此渲染器的抗锯齿属性 antialias 可以设置为 false。
            antialias:true,
            // 色彩映射
            toneMapping:THREE.ACESFilmicToneMapping,
            // //色调编码 更好地存储颜色 最好使用sRGBEncoding(失去效果)
            // outputEncoding: THREE.sRGBEncoding,
        }}
        // orthographic 远距离相机
        orthographic
        camera={
            camraSettings
        }
    >
        <Experience />
    </Canvas>
) 