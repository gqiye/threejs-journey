import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/3.png')

/**
 * 字体
 */
const fontLoader = new FontLoader()
// 加载函数
fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) =>{
        const textGeometry = new TextGeometry( 'Hello three.js! ', {
            font: font,
            size: 0.5,
            height: 0.2,
            // 曲线段 生成图形的细粒度
            curveSegments: 5,
            // 斜面
            bevelEnabled: true,
            // 斜角厚度 z 
            bevelThickness: 0.03,
            // 字体倾斜度 x,y
            bevelSize: 0.02,
            bevelOffset: 0,
            // 斜线段
            bevelSegments: 4
        } );
        // 方法一 
        // 移动中间 计算盒子边界问题
        // textGeometry.computeBoundingBox()
        // textGeometry.boundingBox 获取盒子位置
        // 
        // 手动移动字体到中间
        // textGeometry.translate(
        //     // 0.02 为 bevelSize
        //     -(textGeometry.boundingBox.max.x -0.02 )*0.5,
        //     -(textGeometry.boundingBox.max.y -0.02 )*0.5,
        //     // 0.03为bevelThinckness
        //     -(textGeometry.boundingBox.max.z -0.03 )*0.5
        // )

        // 方法二 
        textGeometry.center()

        // 将字体添加进一个网格模型
        // const textMaterial = new THREE.MeshBasicMaterial()
        // textMaterial.wireframe=true
        // 使用 matcap
        const  material = new THREE.MeshMatcapMaterial()
        material.matcap = matcapTexture;
        const text = new THREE.Mesh(textGeometry,material)
        scene.add(text)
        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

        for (let i = 0; i < 200; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)


/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// 可以继续优化,使用同一个材料
// console.time('donut')
// const  material = new THREE.MeshMatcapMaterial()
// const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

//   for (let i = 0; i < 200; i++) {
//     const donut = new THREE.Mesh(donutGeometry, material)

//     donut.position.x = (Math.random() - 0.5) * 10
//     donut.position.y = (Math.random() - 0.5) * 10
//     donut.position.z = (Math.random() - 0.5) * 10

//     donut.rotation.x = Math.random() * Math.PI
//     donut.rotation.y = Math.random() * Math.PI

//     const scale = Math.random()
//     donut.scale.set(scale, scale, scale)
//     scene.add(donut)
// }
// console.timeEnd('donut')
// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()