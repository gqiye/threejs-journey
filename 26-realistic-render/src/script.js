import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 * 真实渲染的一个基本特征在于使用环境贴图来照亮模型。
 * 前面已经教过如何使用envMap属性将环境贴图应用到标准网格材质MeshStandardMaterial中，现在的问题在于我们的模型是由许多个网格Mesh组成的，因此我们要使用 
  * traverse(…)方法来遍历场景中的所有三维物体Object3D类对象，包括继承自Object3D的Group和Mesh。
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        { 
            child.material.envMapIntensity = global.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        //    新版本不需要?
            // child.material.needsUpdate =true
        } 
    })
}

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1
gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    // 场景背景贴图a
    scene.background = environmentMap
    // 有一种更简单的方法将环境贴图应用到所有对象上，
    // 我们可以像更改场景的background属性一样去更改场景的environment属性。
    // 这样做的话就不必再在updateAllMaterials函数中去设置环境贴图了。
    // 但是我们仍然无法直接从场景里更改每个材质的环境贴图强度，因此还是需要updateAllMaterials函数。
    scene.environment = environmentMap

})

/**
 * Models
 */
// Helmet
/**
 * 
 * 看到汉堡包表面有些奇怪的条纹，这种情况被称为“阴影失真shadow acne”
 * 在计算曲面是否处于阴影中时，由于精度原因，阴影失真可能会发生在平滑和平坦表面上。
 * 而现在在汉堡包上发生的是汉堡包在它自己的表面上投射了阴影。
 * 因此我们必须调整灯光阴影shadow的“偏移bias”和“法线偏移normalBias”属性来修复此阴影失真。
 * bias通常用于平面，因此不适用于我们的汉堡包。但如果你有在一块平坦的表面上出现阴影失真，
 * 可以试着增加偏差直到失真消失。
 * normalBias通常用于圆形表面，因此我们增加法向偏差直到阴影失真消失。
 */
gltfLoader.load('/models/hamburger.glb', gltf => {
    gltf.scene.scale.set(0.3, 0.3, 0.3)
    gltf.scene.position.set(0, 1.5, 0)
    
    gltf.scene.rotation.y = Math.PI * 0.5
  
    scene.add(gltf.scene)
  
    updateAllMaterials()
  })
// gltfLoader.load(
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(10, 10, 10)
//         scene.add(gltf.scene)

//         updateAllMaterials()
//         gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('头盔旋转')
//     }
// )

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
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff',3)
directionalLight.position.set(0.25,3,-2.25)
// 设置平行光投射阴影
directionalLight.castShadow = true
// 优化阴影贴图 https://blog.csdn.net/weixin_43990650/article/details/121681722
// 看项目的shadow
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
// 添加相机助手查看，可以的话就移除掉助手。
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

// 通常用于圆形表面，因此我们增加法向偏差直到阴影失真消失
directionalLight.shadow.normalBias = 0.05

scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('光照强度')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('光X')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('光Y')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('光Z')

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // 只能在实例化的时候开启
    // 像素高的显示屏看不出来
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
// 设置渲染器开启阴影贴图，并将类型设为THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap



gui
  .add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    // 如果我们在外面打印值比如console.log(THREE.ReinhardToneMapping)你会发现输出结果是数字类型的3
    // 然而当我们把对象放到dat.GUI面板里面后其会将值给转化为字符串，导致控制台报警告
    // 因此我们需要在这里将其重新转化为数字类型
    renderer.toneMapping = Number(renderer.toneMapping)
    // 更新材料
    updateAllMaterials()
  })
  renderer.toneMappingExposure = 3
  // 添加到gui面板
//   更改色调映射曝光度toneMappingExposure
  gui
    .add(renderer, 'toneMappingExposure')
    .min(0)
    .max(10)
    .step(0.001)


////解决加载gltf格式模型纹理贴图和原图不一样问题
// renderer.outputEncoding = THREE.sRGBEncoding;
// 上面这个新版本已经废弃默认就是SRGBColorSpace

// //新版本，加载gltf，不需要执行下面代码解决颜色偏差
// renderer.outputColorSpace = THREE.SRGBColorSpace;//设置为SRGB颜色空间
// 文档  https://threejs.org/docs/index.html#api/zh/loaders/CubeTextureLoader
// 当使用sRGBEncoding时，其实就像使用默认gammaFactor值为2.2的GammaEncoding。
// renderer.outputColorSpace  = THREE.GammaEncoding

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()