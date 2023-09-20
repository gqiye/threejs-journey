import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// 引入GLTFLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 引入DRACOLoader 
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
/**
 * draco使用情况
 * 确实它会让几何体更轻量，但首先要使用的时候必须加载DracoLoader类和解码器。
 * 其次，我们计算机解码一个压缩文件需要时间和资源，这可能会导致页面打开时有短暂冻结，即便我们使用了worker和WebAssembly。
 * 根据实际来决定使用什么解决方案
 * 一个模型具有100kb的几何体，那么则不需要Draco压缩
 * 如果我们有MB大小的模型要加载，并且不关心在开始运行时有些许页面冻结，那么便可能需要用到Draco压缩。
 * */

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
 * models 
 */
// 实例化draco加载器
const dracoLoader = new DRACOLoader()
// three.js提供了Draco解码器的代码，
// 可以去/node_modules/three/examples/js/libs/ 找到该文件夹，复制整个文件夹到static文件夹下
// 通过.setDecoderPath()方法将文件提供给dracoLoader。
dracoLoader.setDecoderPath('/draco/')

// 实例化GLTF加载器
const gltfLoader = new GLTFLoader()
// 在使用draco的时候才需要设置
// 不使用draco存在的时候也没问提,不会引用到
// 使用setDRACOLoader()将DRACOLoader实例dracoLoader提供给GLTFLoader实例gltfLoader
gltfLoader.setDRACOLoader(dracoLoader)

// 使用DracoLoader需要向GLTFLoader提供一个DracoLoader实例
gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', gltf => {
    scene.add(gltf.scene)
  })

// 另外三种引入方式
// gltfLoader.load(
//     '/models/Duck/glTF-Binary/Duck.glb', // glTF-Binary
// gltfLoader.load(
//     '/models/Duck/glTF-Embedded/Duck.gltf', // glTF-Embedded

// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf )=> {
//     // 
//     console.log(gltf,gltf.scene)
    /** 
    THREE.Group: scene
       └───Array: children
            └───THREE.Object3D
                  └───Array: children
                        ├───THREE.PerspectiveCamera
                        └───THREE.Mesh 网格就是我们的小黄鸭模型。
    添加模型的5种方式
    1.往我们的场景中添加上面整个场景scenes对象，虽然它也叫做scene，但实际上它是一个组Group
    2.将scene对象中的children对象添加到场景中，并忽略未被使用到的透视摄像机
    3.在添加到场景之前先过滤children对象，移除不需要的对象像是透视摄像机(麻烦对象太多)
    4.仅仅添加网格到场景中，但结果可能会是鸭子模型被错误缩放、定位或者旋转
    scene.add(gltf.scene.children[0])

    多个元素的模型 ,不能使用for循环
    当我们把scene.children数组中的子元素从一个场景移到另一个场景的时候，它会自动从被移除的场景中删除掉，
    意味着我们循环的数组长度变小了。当我们添加第一个对象时，它会从原来的场景中移除，
    然后第二个对象便会移动到替补上去。因此这里我们可以采用while循环来添加模型网格
    */
    // 方法一
    // while (gltf.scene.children.length) {
    //     scene.add(gltf.scene.children[0])
    // }
    // 方法二
    // const children = [...gltf.scene.children]
    // for(const child of children){
    //     scene.add(child)
    // }
    // 方法三
//     gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', gltf => {
//         scene.add(gltf.scene)
//       })
// }
// ,()=>{
//     console.log("success")
// },
// ()=>{
//     console.log("project")
// },
// ()=>{
//     console.log("error")
// }
// )


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()