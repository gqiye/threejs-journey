import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * 调试插件
 */
const gui = new dat.GUI()
/**
 * 环境加载器
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
// 一个环境的周围的图片
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
  ])



/**
 * 纹理加载器 引入图片 textures
 */

const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
// const gradientTexture = textureLoader.load('/texttures/gradients/5.jpg')

// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps=false

// THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * object
 */
// 符合现实的材料,需要光照才能显示
const material = new THREE.MeshStandardMaterial()
// 图片材质
// material.map = doorColorTexture
// material.color.set('yellow')
// 金属程度
material.metalness = 0.7
// 金属程度贴图
// material.metalnessMap = doorMetalnessTexture

// 粗糙程度
material.roughness = 0.2
// 粗糙程度贴图
// material.roughnessMap = doorRoughnessTexture
// material.wireframe =true
// 透明程度
// material.opacity = 0.5 
// material.transparent = true
// aomap(ambient occlusion map) 环境遮挡图 需要增加uv2
// 实验证明uv2可以不加,但是是不知道为什么课程需要
// material.aoMap = doorAmbientOcclusionTexture
// 强度
// material.aoMapIntensity = 1
/**
 * 位移图
 * 图片白色部分向上,黑色部分向下,灰色部分不动
 * */ 
// 置换贴图会影响网格顶点的位置。与其他仅影响材质明暗的贴图不同，位移顶点可以投射阴影、阻挡其他对象，并以其他方式充当真实几何体。置换纹理是一种图像，其中每个像素的值（白色最高）映射到网格的顶点并重新定位
// material.displacementMap = doorHeightTexture
// 影响位移图强度
// material.displacementScale = 0.05
/**
 * 法线材质
 */
// 法线贴图 ,让物体有更多的细节效果
// material.normalMap =doorNormalTexture 
// 微调整法线痕迹
// material.normalScale.set(0.5,0.1)

/**
 * 阿尔法纹理 alphamap ,隐藏不应该显示的图像就让显示的图片尺寸溢出隐藏
 */
// alphamap 生效前提
// material.transparent =true
// material.alphaMap = doorAlphaTexture

/**
 * 材料有灯光的反射 比较占性能
 * const material = new THREE.MeshPhongMaterial()
 * 该材料可以调节的属性
 *  光照反射强度
 * material.shininess = 100
 *  光照反射颜色 
 * material.specular = new THREE.Color(0x1188ff)
 */

/**
 * 对材质进行预处理 ,但是效果没显示,效果也是将渐变明显出来
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
    gradientTexture.generateMipmaps=false
 * 颜色渐变会有明显的变化
 * const material = new THREE.MeshToonMaterial()
 * 不知道是不是mac电脑和window电脑的区别,mac渐变明显,window全灰
 * material.gradientMap = gradientTexture
 */

// 环境贴图
material.envMap = environmentMapTexture

// 可以使用gui控制每个属性点
gui.add(material,'metalness').min(0).max(10).step(0.0001)
gui.add(material,'roughness').min(0).max(10).step(0.0001)
gui.add(material,'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material,'displacementScale').min(0).max(10).step(0.0001)
// gui.add(material,'displacementMap').min(0).max(10).step(0.0001)
// 球
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    material
)
// 偏移
sphere.position.x = -1.5;
// uv 法线
// 是一个8位数的数组,每两个值代表顶点
// plane.geometry.attributes.uv  
// 设置一个新的法线数据
sphere.geometry.setAttribute(
    // 参数 uv 加 2 每两个值点代表顶点
    'uv2', new THREE.BufferAttribute(
        sphere.geometry.attributes.uv.array,2)
)

//平面
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,100,100),
    material
    )

plane.geometry.setAttribute(
    // 参数 uv 加 2 每两个值点代表顶点
    'uv2', new THREE.BufferAttribute(
        plane.geometry.attributes.uv.array,2)
)


// 环
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3,0.2,64,128),
    material
)
torus.position.x = 1.5;
torus.geometry.setAttribute(
    // 参数 uv 加 2 每两个值点代表顶点
    'uv2', new THREE.BufferAttribute(
        torus.geometry.attributes.uv.array,2)
)

scene.add(sphere,plane,torus)


/**
 * 光照
 */
// 参数 灯光颜色 intensity(强度)
const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

// 增加点光 在物体表面有光亮的色泽,具体参数应用待研究
const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


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
    
    // update object



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()