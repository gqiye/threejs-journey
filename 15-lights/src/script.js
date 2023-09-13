import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

THREE.ColorManagement.enabled = false

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
 * 最小使用成本的灯光 为 AmbientLight 和  HemisphereLight
 * 中等程度 DirectionalLight 和 PointLight
 * 性能耗费高 SpotLight 和 RectAreaLight
 * 可以使用bake 制作灯光纹理效果 缺点,灯光无法移动 
 */
// 环境光 全范围光照
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// 方向灯 光线平行,像太阳光 
const  directionalLight = new THREE.DirectionalLight(0x00fffc,0.3)
// 改变照射方向
directionalLight.position.set(1,0.25,0) 
scene.add(directionalLight)

// 半球光 
// 第一参数上面的光色 ,第二个参数下面的光色,中间两种颜色混合 ,第三个参数,强度
// 应用场景 天蓝色 绿色
const hemisphereLight = new THREE.HemisphereLight(0xff0000,0x0000ff,1)
scene.add(hemisphereLight)


// 定向光源
// 1.颜色 2.强度 3.距离 4.衰变 
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// 矩形补光灯
// 只适用于standardMaterial 和 physicalMaterial
// 1. 颜色 2. 强度  3. 宽度 4.长度
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,20,1,1);
// 设置方向
rectAreaLight.position.set(-1.5,0,1.5)
// 设置照射方向
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// 聚光灯
// 1.颜色 2.强度 3.距离 4.角度 5.有点像边缘过度光效  6. 衰变
const spotLight = new THREE.SpotLight(0x78ff00,0.5,6,Math.PI*0.1,0.25,1) 
// 位置
spotLight.position.set(0,2,3)
scene.add(spotLight)
// 聚光灯照向物体的角度
spotLight.target.position.x =-0.75
// 必须添加了才有效果
scene.add(spotLight.target)


/**
 * 光照助手
 */
// 半球形光照助手
// 1. 半球形光照 2.大小
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,0.2
)
scene.add(hemisphereLightHelper)

// 方向灯助手
const directionalLightHelper = new THREE.   (
    directionalLight,0.2
)
scene.add(directionalLightHelper)

// 点灯助手
const pointLightHelper = new THREE.PointLightHelper(
    pointLight,0.2
)
scene.add(pointLightHelper)

// 聚光灯
const SpotLightHpler = new THREE.SpotLightHelper(
    spotLight
)
scene.add(SpotLightHpler)
// 需要在下一帧进行更新
window.requestAnimationFrame(()=>{
    SpotLightHpler.update()
})

// 矩形聚光灯
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(rectAreaLightHelper)
// 需要在下一帧进行更新
window.requestAnimationFrame(()=>{
    rectAreaLightHelper.position.copy(rectAreaLight.position)
    // 四元数一样的效果
    // rectAreaLightHelper.quaternion.copy(rectAreaLight.position)
    rectAreaLightHelper.update()
})


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()