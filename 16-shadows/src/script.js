import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * textureLoader
 * baked 阴影纹理效果
 */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simlpeShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 * 只有三种灯光支持投阴影
 * pointLight DirectionalLight spotLight 
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)
// console.time('directionalLight')

/**
 *  Directional light
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)


// 设置灯光能补获 阴影
directionalLight.castShadow =true;

// 阴影保存在灯光的shadow
console.log("directionalLight.shadow", directionalLight.shadow)

// 修改阴影地图的分辨率 2的幂 
directionalLight.shadow.mapSize.width =1024
directionalLight.shadow.mapSize.height = 1024
// 阴影相机位置 调整一个小的渲染范围,减少gpu渲染
// 缩小渲染范围,会使渲染效果更好
// 因为一个渲染地图太大会导致里面小的物体变小分辨率
// 如果小的地图和小的物体无疑会渲染效果更好
directionalLight.shadow.camera.top=2
directionalLight.shadow.camera.right=2
directionalLight.shadow.camera.bottom=-2
directionalLight.shadow.camera.left=-2
// 阴影相机 相机距离物体的远近
// 缩小渲染范围,会使渲染效果更好
directionalLight.shadow.camera.near =1 
directionalLight.shadow.camera.far =6

// 阴影模糊效果
directionalLight.shadow.radius = 10; 


// 新建一个阴影相机助手 也是基于灯光的位置
const directionalLightCamerHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
)
// 隐藏助手
directionalLightCamerHelper.visible = false
scene.add(directionalLightCamerHelper)


/**
 * spot light
 */
const spotLight = new THREE.SpotLight(
    0xffffff,0.4,10,Math.PI*0.3
)
spotLight.castShadow= true;
// 优化阴影效果
spotLight.shadow.mapSize.width =1024;
spotLight.shadow.mapSize.height =1024;
// 阴影视场变小
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near =1
spotLight.shadow.camera.far = 6

spotLight.position.set(0,2,2)
scene.add(spotLight)
scene.add(spotLight.target)

// 助手
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

/**
 * point Light
 */
const pointLight = new THREE.PointLight(0xffffff,0.3);
pointLight.castShadow = true;
// 优化阴影
pointLight.shadow.mapSize.width =1024;
pointLight.shadow.mapSize.height =1024;
pointLight.shadow.camera.near =1
pointLight.shadow.camera.far = 6

// 照射方向有点像透视相机的,如果是四面八方的照射,会导致一些事故
pointLight.position.set(-1,1,0);
scene.add(pointLight)

// 增加助手
const pointLightCameraHelper = new THREE.CameraHelper(
    pointLight.shadow.camera
)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

// console.timeEnd('directionalLight')
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
// 设置球体可以投下阴影
sphere.castShadow =true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
    // 加载有阴影的物料
    // new THREE.MeshBasicMaterial({
    //     map:bakedShadow
    // }
    // )
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
// 设置平面可以接收阴影
plane.receiveShadow =true


scene.add(sphere, plane)


//增加一个阴影
const  sphereShdow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5,1.5),
    new THREE.MeshBasicMaterial({
        color:0x000000,
        // alphamap 使用先决条件
        transparent:true,
        alphaMap:simlpeShadow
    })
)
// 旋转,平移
sphereShdow.rotation.x = - Math.PI *0.5
sphereShdow.position.y = plane.position.y +0.01
scene.add(sphereShdow)


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

// 渲染器阴影开启
renderer.shadowMap.enabled = false
// 阴影渲染算法选择
// 边缘好看
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 有模糊效果
// renderer.shadowMap.type = THREE.PCFShadowMap


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //球进行绕原点旋转弹跳
    // x轴左右移动
    sphere.position.x = Math.cos(elapsedTime)*1.5;
    // z轴里外移动 
    sphere.position.z = Math.sin(elapsedTime)*1.5;
    // y 轴上下移动 保持为正值 *3 是加速度
    sphere.position.y = Math.abs(Math.sin(elapsedTime*3))
    
    /**
     * 阴影部分跟随
     */
    sphereShdow.position.x = sphere.position.x;
    sphereShdow.position.z = sphere.position.z;
    // y 轴阴影部分的浅深
    sphereShdow.material.opacity = (1 - sphere.position.y)*0.8
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()