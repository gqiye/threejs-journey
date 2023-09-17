import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor').onChange(() => {
        material.color.set(parameters.materialColor)
        particesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * objects
 */
// distance
const objectsDistance = 4 

// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
// 渐变色的层次感更加明显
gradientTexture.magFilter = THREE.NearestFilter

// material 
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// mesh
const mesh1 = new THREE.Mesh(
    // 圆环模型
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
);

const mesh2 = new THREE.Mesh(
    // 椎体
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    // 圆环结几何
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - objectsDistance*0
mesh2.position.y = - objectsDistance*1
mesh3.position.y = - objectsDistance*2

mesh1.position.x =  2
mesh2.position.x = - 2
mesh3.position.x =  2
scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * partice 粒子几何
 */
const particesCount = 200
const position = new Float32Array(particesCount * 3)

for (let i = 0; i < particesCount; i++) {
    position[i*3 +0] =(Math.random() -0.5)*10;
    position[i*3 +1] =objectsDistance*0.5 - Math.random() *objectsDistance*sectionMeshes.length;
    position[i*3 +2] =(Math.random()-0.5 )*10;
}
// 网格、线或点几何图形的表示形式。缓冲区内包括顶点位置、面索引、法线、颜色、UV 和自定义属性，从而降低了将所有此类数据传递到 GPU 的成本。
const particesGeometry = new THREE.BufferGeometry()
// 这里参数
particesGeometry.setAttribute('position', new THREE.BufferAttribute(position,3))

// material 
const particesMaterial = new THREE.PointsMaterial(
    {
        color:parameters.materialColor,
        // 指定点的大小是否因相机深度而衰减。（仅限透视相机。默认值为 true。
        sizeAttenuation:true,
        size:0.03
    }

)
// point object  跟mesh同个层级
const particles = new THREE.Points(particesGeometry,particesMaterial)
scene.add(particles)



/**
 * light
 */
//定向光 太阳光 
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
// Group camera
const cameraGroup = new  THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha - 控制默认的清除 alpha 值。设置为 true 时，值为 0 。否则是 1 .默认值为 false 。
    // 看起来有点像背景颜色,将three的背景去掉
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */

let  scrollY = window.scrollY;
// 屏幕滚动整个的时候
let currentSection = 0

window.addEventListener('scroll',()=>{

    scrollY = window.scrollY;
    const newSection = Math.round(scrollY /sizes.height);
    if (newSection != currentSection) {
        currentSection = newSection
        // 每次过一个完整的屏幕长度的时候触发一次,快速旋转的动画
        gsap.to(
            // 这里指定了动画方式为rotation
            sectionMeshes[currentSection].rotation,{
                duration:1.5,
                // 缓慢结束动画? ease应该是动画效果
                // 以 2 的幂轻松进出
                ease:'power2.inOut',
                x:'+=6',
                y:"+=3",
                z:"+=1.5"
                 
            }
        )
    }
})

/**
 * cursor
 */
const cursor = {}
cursor.x = 0;
cursor.y = 0;
window.addEventListener('mousemove',(event)=>{
    // 调整为 -0.5 到 0.5 
    cursor.x = event.screenX /sizes.width - 0.5
    cursor.y = event.screenY /sizes.height - 0.5
})



/**
 * Animate
 */
const clock = new THREE.Clock()

let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // animate camera
    // 计算滚动距离 滚动距离 / 视口距离  == 1只会滚动一个屏幕距离 , 然后乘以 物体之间距离,就可以实现
    camera.position.y = - scrollY / sizes.height * objectsDistance

    // 计算每天机器渲染一帧的时间
    // 0.16 = 1/60  通常为60fps
    // 我自己为 144fps  计算 1/144 0.0006
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    // animate  cursor 
    // 利用照相机群组解决y轴冲突问题
    // 群组移动和 照相机移动分割开
    // 不要将物体移动太快
    const parallaX = cursor.x * 0.5
    const parallaY = - cursor.y * 0.5
    // console.log(cameraGroup.position.x) 
    cameraGroup.position.x += (parallaX - cameraGroup.position.x)*5*deltaTime
    cameraGroup.position.y += (parallaY - cameraGroup.position.y)*5*deltaTime
    console.log(deltaTime)
    // animate meshes
    // += 是因为在gasp 有一个动画,主动增加x.y轴值,为了不被覆盖,因此用+=
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime *0.1;
        mesh.rotation.y += deltaTime *0.12;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()