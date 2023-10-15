import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * texture
 */

const bakedTexture = textureLoader.load('/baked.jpg')
// 纹理被翻转渲染,要翻转回来
bakedTexture.flipY = false
// 设置色彩空间 blender建模的时候使用sRGB 所以要切换
// 切换之后设置渲染器
// 152+ encoding 遗弃改为colorSpace (THREE.TextureDataType)
// defaultValue--THRE.LinearEncoding
// 152+ THREE.sRGBEncoding 被遗弃改为 THREE.SRGBColorSpace
bakedTexture.colorSpace = THREE.SRGBColorSpace;


/**
 * materials
 */

// baked material 烘焙加一个基础物料
const bakedMaterial = new THREE.MeshBasicMaterial({map:bakedTexture})

// 处理灯光纹理
const poleLightMaterial = new THREE.MeshBasicMaterial({color:0xffffe5});

// 传松门纹理
const portalLightMaterial = new THREE.MeshBasicMaterial({color:0xffffff
// 背面看不见这个面，可以使用配置让背面可以被看到
,side:THREE.DoubleSide
});

/**
 * model 模型加载
 */
gltfLoader.load(
    'portal.glb',
    (gltf)=>{
        // traverse 遍历每个元素
        // gltf.scene.traverse((child)=>{
        //     // console.log(child)
        //     child.material = bakedMaterial
        // })
        // console.log(gltf.scene.children)
    // baked
    const bakedMesh = gltf.scene.children.find((child)=>child.name === 'baked')
    // 处理灯光传送门 
    const poleLightAMesh = gltf.scene.children.find((child)=>child.name === 'poleLightA')
    const poleLightBMesh = gltf.scene.children.find((child)=>child.name === 'poleLightB')
    const portalLightMesh = gltf.scene.children.find((child)=>child.name === 'portalLight')
    
    bakedMesh.material = bakedMaterial;
    poleLightAMesh.material = poleLightMaterial;
    poleLightBMesh.material = poleLightMaterial;
    portalLightMesh.material = portalLightMaterial;

        scene.add(gltf.scene)
        // console.log(gltf.scene)
    }
)



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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// 设置与否效果不明显
renderer.outputColorSpace = THREE.SRGBColorSpace;
// renderer.outputEncoding  被遗弃

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