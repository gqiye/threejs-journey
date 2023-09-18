import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'
console.log(CANNON)
THREE.ColorManagement.enabled = false
// https://blog.csdn.net/weixin_43990650/article/details/121815208 这部分课程相关文档
/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * CANNON Physics
 * 物理世界的代码
 */
// 创建物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0,-9.82,0)

/* material 物料 */

// 世界物体的物料都用同一种
const defaultMaterial = new CANNON.Material('default');
// 物料直接的碰撞效果
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial, 
    defaultMaterial,
    {
        // 摩擦系数
        friction:0.1,
        // 弹跳系数
        restitution:0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
// 让物理世界都使用同一种物料
// 注意赋值应该是物体碰撞效果
world.defaultContactMaterial = defaultContactMaterial




/**
 * 多种材料碰撞的演示
 * 需要添加物料到球和地板(对应的物体)
 */

// concrete 混泥土
// const concreteMaterial = new CANNON.Material('concrete');
// // plastic 塑料
// const plasticMaterial = new CANNON.Material('plastic');

// //  两个材料再一起发生什么反应
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial, 
//     plasticMaterial,
//     {
//         // 摩擦系数
//         friction:0.1,
//         // 弹跳系数
//         restitution:0.7
//     }
// )
// // 增加物料到物理世界
// // 以及添加物料到球和地板
// world.addContactMaterial(concretePlasticContactMaterial)




// sphere 球
const sphereShape = new CANNON.Sphere(0.5)
// 类似 threejs 的几何
const sphereBody = new CANNON.Body(
    {
        // 质量
        mass:1,
        // 位置
        position:new CANNON.Vec3(0,3,0),
        // 形状
        shape:sphereShape,
        // 物料
        // material:plasticMaterial 
    }
)
/**
 * 施加力 
 * 
 * applyForce 
 * applylmpulse
    在世界world中的的局部点施加力，这个力会作用到刚体body表面，例如风力
    applyForce ( force , worldPoint )
    force —— 力的大小(Vec3)
    worldPoint —— 施加力的世界点(Vec3)
    下面用applyForce方法来模拟一股与球体运动反方向的持续的风。
    因为要像风一样不断的持续施加力，所以回到动画函数，我们要在更新物理世界前更新每一帧动画。
 * applyLocalForce
    对刚体body中的局部点施加力。
    applyLocalForce ( force , localPoint )
    force —— 要应用的力向量(Vec3)
    localPoint —— body中要施加力的局部点(Vec3)
    在球体中心原点处施加一个力(动画函数外部)，在页面刷新完成那一帧施加力

 * applyLocallmupulse 在世界world中的的局部点施加力 局部坐标
 */

// 对物体施加力
// 参数 force —— 力的大小(Vec3)
// worldPoint —— 施加力的世界点(Vec3)
//  在球体中心原点处施加一个力(动画函数外部)，在页面刷新完成那一帧施加力
sphereBody.applyLocalForce(new CANNON.Vec3(150,0,0),new CANNON.Vec3(0,0,0))

// 将物体添加到world场景
world.addBody(sphereBody)

// floor 地板
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body()
// 添加物料
// floorBody.material = concreteMaterial

floorBody.mass = 0 ;
floorBody.addShape(floorShape)
// setFromAxisAngle(axis: CANNON.Vec3, angle: number)
// axis 围绕该轴旋转, angle 旋转多少度
// 四元数的旋转
floorBody.quaternion.setFromAxisAngle(
    // 绕着该轴旋转90度
    new CANNON.Vec3(-1,0,0),
    Math.PI*0.5
)


world.addBody(floorBody)




/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let  oldElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // 屏幕帧的时间差 1/144
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime

    /**
     * 
     * 在世界world中的的局部点施加力，这个力会作用到刚体body表面，例如风力
     * applyForce ( force , worldPoint )
     * force —— 力的大小(Vec3)
     * worldPoint —— 施加力的世界点(Vec3)
     * 下面用applyForce方法来模拟一股与球体运动反方向的持续的风。
     * 因为要像风一样不断的持续施加力，所以回到动画函数，我们要在更新物理世界前更新每一帧动画。
     */
    sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0),sphereBody.position)
    
    /**
     * physics world 物理世界更新
     * 参数
     * 1. 固定时间戳  一般使用值 1/60  代表一秒60帧
     * 2.上一步花费的时间 (自上次调用函数以来经过的时间。) 
     * 3.每个函数调用要执行的最大固定步骤数。
     * how much iterations the world can apply to catch up with a potential delay 世界可以应用多少迭代来赶上可能的延迟 
     * 官网文档 https://schteppe.github.io/cannon.js/docs/classes/World.html#method_step
     * 文档 https://gafferongames.com/post/fix_your_timestep/ 
     */
    world.step(1/60,deltaTime,3)

    // 将物理世界的物体坐标赋值给threejs的物体
    sphere.position.copy(sphereBody.position)
    // sphere.position.x = sphereBody.position.x
    // sphere.position.y = sphereBody.position.y
    // sphere.position.z = sphereBody.position.z

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()