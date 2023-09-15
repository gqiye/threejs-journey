import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width:300})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy 星系
 */
const parameters = {
    count:1000,
    size:0.02
}




const generateGalay = ()=>{
    /**
     * Geometry 几何图形
     */
    const geometry = new THREE.BufferGeometry()
    // 生成3000个值为0的数组
    const positions = new Float32Array(parameters.count * 3)
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i*3;
        
        positions[i3] =  (Math.random()-0.5)*3
        positions[i3+1] =(Math.random()-0.5)*3
        positions[i3+2] =(Math.random()-0.5)*3
        
    }

    geometry.setAttribute('position', 
    // 顶点数组 ,顶点个数
    new THREE.BufferAttribute(positions,3))

    /**
     * Material 材质
     */
    const material = new THREE.PointsMaterial({
        size:parameters.size,
        // 指定点的大小是否因相机深度而衰减。（仅限透视相机。默认值为 true。
        sizeAttenuation:true,
        // 渲染此材质是否对深度缓冲区有任何影响。默认值为 true 
        // 绘制 2D 叠加时，禁用深度写入以将多个内容分层在一起而不会创建 z 索引伪影非常有用。
        depthWrite:false,
        // 使用此材质显示对象时要使用的混合
        // 混合模式 必须将其设置为自定义混合才能使用自定义blendSrc，blendDst或blendEquation。
        // 添加剂混合
        blending:THREE.AdditiveBlending
    });
    /**
     * Point 点  
     * 用于显示点的类
     */
    const point = new THREE.Points(geometry,material)
    scene.add(point)
    
}

generateGalay()
/**
 * gui 控制
 */
gui.add(parameters,'count').min(100).max(100000).step(100).onFinishChange(generateGalay)
gui.add(parameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalay)

 
/** 
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
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
camera.position.z = 3
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