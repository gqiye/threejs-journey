import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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
 * fog 雾
 * 参数 1.颜色 2.近near 3.远far
 */
const fog = new THREE.Fog('#262837',1,15)
scene.fog =fog


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// 加载纹理效果图片
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
)
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
)

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
)
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load(
  '/textures/grass/roughness.jpg'
)

// 设置贴图重复
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
// 设置纵轴允许重复
grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
// 设置横轴允许重复 
grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// walls  墙体
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:bricksColorTexture,
        aoMap:bricksAmbientOcclusionTexture,
        // 也是法线贴图
        // 用于创建法线贴图的纹理。RGB 值会影响每个像素片段的表面法线，并更改颜色的照明方式。法线贴图不会改变表面的实际形状，只会改变照明。
        // 如果材质具有使用左手约定创作的法线贴图，则应否定 normalScale 的 y 分量以补偿不同的惯用手性。
        normalMap:bricksNormalTexture,
        // 粗糙程度
        // 材料的粗糙程度。 0.0 表示平滑的镜面反射， 1.0 表示完全漫射。默认值为 1.0 。如果还提供了粗糙度映射，则两个值相乘。
        roughnessMap:bricksRoughnessTexture
    })
)
// aoMap 需要设置uv2
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
)
walls.position.y = 2.5/2;
// 将walls归到house
house.add(walls)

// roof 屋顶
const roof = new THREE.Mesh(
    // 椎体
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
)
roof.position.y = 2.5 + 1/2 ;
// Math.PI 一个半圆圈
roof.rotation.y = Math.PI * 0.25

house.add(roof)

// door 门
const door = new THREE.Mesh(
    // plane 平面几何
    // 参数 1.宽度 2.高度 3.宽度顶点个数 (宽段) 4. 长度顶点个数 
    new THREE.PlaneBufferGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map:doorColorTexture,
        // 使用alphaMap前提
        transparent:true,
        // 只显示白色部分 ,具体待研究
        // Alpha 贴图是一种灰度纹理，用于控制整个表面的不透明度（黑色：完全透明;白色：完全不透明）。默认值为空。
        alphaMap:doorAlphaTexture,
        // aomap 纹理系效果需要设置uv2属性
        // 此纹理的红色通道用作环境光遮蔽贴图。默认值为空。aoMap 需要第二组 UV。
        aoMap:doorAmbientOcclusionTexture,
        // 设置纹理效果强度,但是依旧好像还是不需要uv2设置
        aoMapIntensity:4,
        // 位移贴图,增加层次感
        // 置换贴图会影响网格顶点的位置。与其他仅影响材质明暗的贴图不同，位移顶点可以投射阴影、阻挡其他对象，
        // 并以其他方式充当真实几何体。置换纹理是一种图像，其中每个像素的值（白色最高）映射到网格的顶点并重新定位。
        displacementMap: doorHeightTexture,
        // 位移程度修改
        displacementScale:0.1,
        // 金属度贴图 有灯光的时候
        // 这种纹理的蓝色通道用于改变材料的金属性。
        metalnessMap:doorMetalnessTexture,
        // 粗糙程度纹理,反光
        // 材料的粗糙程度。 0.0 表示平滑的镜面反射， 1.0 表示完全漫射。默认值为 1.0 。如果还提供了粗糙度映射，则两个值相乘。
        roughnessMap:doorRoughnessTexture

    })
)
// aoMap 需要设置uv2 看不出区别
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
)
door.position.y =1 ;
door.position.z = 2 +0.01;

house.add(door)

// bushes 灌木丛
// SphereBufferGeometry 1.半径 2.宽度段 3.高度段
const bushGeometry = new THREE.SphereBufferGeometry(1,16,16);
const bushMaterial = new THREE.MeshStandardMaterial({color:"#89c854"})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

/**
 * graves 
 */
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6,0.8,0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color:"#b2b6b1"})



for (let i = 0; i < 50; i++) {
    const grave = new THREE.Mesh(graveGeometry,graveMaterial);
    // 随机数 0-1 * 圆周率 *3
    // 这个圆周率是一个常量，不用感觉也行
    const angle =  Math.random() * Math.PI*3;
    const radius = 3 +Math.random()*6; 
    // 真正起一个圆环作用的是sin 函数和 cos 函数
    grave.position.x =Math.sin(angle) *radius ;
    grave.position.y =0.3 ;
    grave.position.z =Math.cos(angle) *radius ;
    
    grave.rotation.y= (Math.random() -0.5)*0.4;
    grave.rotation.z = (Math.random() -0.5)*0.4;
    // 开始grave的阴影,记得在地板开始接收阴影
    grave.castShadow =true;
    graves.add(grave)
    
}







// Floor 地板 
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map:grassColorTexture,
        aoMap:grassAmbientOcclusionTexture,
        normalMap:grassNormalTexture,
        roughnessMap:grassRoughnessTexture
     })
)
// aoMap 需要设置uv2 看不出区别
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
// 强度和颜色可以模拟一个昏暗环境
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// door light
const doorLight = new THREE.PointLight('#ff7d46',1,7);
doorLight.position.set(0,2.2,2.7);
house.add(doorLight)

/**
 * Ghosts 模拟鬼魂 移动点灯
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
// 设置跟雾一样的颜色,边缘就会产生看不到的效果,也就是无物体的颜色改为雾的颜色
renderer.setClearColor('#262837')
/**
 * shadows
 */
// 开启渲染阴影
renderer.shadowMap.enabled =true;
// 阴影效果优化
renderer.shadowMap.type =THREE.PCFSoftShadowMap

// 灯光能产生阴影
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
// 物体能被灯光照射出阴影
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
// 接受grave的阴影
floor.receiveShadow = true

// 优化阴影效果,一般都是需要用助手进行慢慢优化的
// 减少阴影贴图渲染大小以提高性能:

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // update ghosts 
    const ghostAngle = elapsedTime *0.5;
    // 绕圈
    ghost1.position.x = Math.cos(ghostAngle)*4
    ghost1.position.z = Math.sin(ghostAngle)*4
    // 加跳动
    ghost1.position.y = Math.sin(ghostAngle*2)

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    // 绕圈波浪线跳动
    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
  
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()