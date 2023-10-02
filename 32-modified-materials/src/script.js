import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

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
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 1
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg')
mapTexture.colorSpace = THREE.SRGBColorSpace
const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg')

// Material
const material = new THREE.MeshStandardMaterial( {
    map: mapTexture,
    normalMap: normalTexture
})
// 阴影使用的是深度网格材质，我们可以在网格上使用customDepthMaterial属性覆盖该材质以便让Three.js使用自定义材质。
// 首先，创建一个深度网格材质并设置其 depthPacking属性值为THREE.RGBADepthPacking
const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking
})

// 在函数外部声明一个变量：
const customUniforms = {
        uTime: { value: 0 }
      }
/**
 * 改模型位置
        访问其原始着色器，为此我们可以使用材质的onBeforeCompile方法
        使用shader源码作为参数，用于修改内置材质：
        旋转案例讲解 https://thebookofshaders.com/08/
        main函数外边的有一个块是common，这个块的优点是它位于所有着色器中，替换它
 * @param {*} shader 
 */

material.onBeforeCompile = (shader) =>
{
    // 将名为uTime的uniform发送到着色器：
    shader.uniforms.uTime = customUniforms.uTime
    // 替换common
    // 公共方法放置
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )
    /**
     * 修改法线位置
     * 当我们旋转顶点时，我们只旋转了位置，但没有旋转法线，因此需要修改处理法线的块。
     * 阴影只应用于默认材质
     * 处理法线的块称为beginnormal_vertex。让我们将其替换为material，记住不是depthMaterial，因为这阴影材质不需要法线：
     * 查看/node_modules/three/src/renderers/shaders/ShaderChunks/beginnormal_vertex.glsl.js，
     * 会看到法线变量名为objectNormal，因此我们会对其进行扭曲旋转的相同操作：
     * (记得移除begin_vertex中的angle和rotateMatrix以避免重复声明)
     * 
    */
    shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
            #include <beginnormal_vertex>

            float angle = (position.y + uTime) * 0.1;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = objectNormal.xz * rotateMatrix;
        `
    )

    // 替换begin_vertex
    // 位置变量修改
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',

        `
            #include <begin_vertex>
            // 根据顶点高度改变角度：
            // float angle = position.y * 0.9;
            // float angle = 0.3;
            // float angle= (position.y+uTime)*0.1  ;
            // 使用get2dRotateMatrix函数创建rotateMatrix矩阵变量，然后旋转该矩阵
            // mat2 rotateMatrix = get2dRotateMatrix(angle);
            
            transformed.xz = rotateMatrix * transformed.xz;
        `
        )

}




/**
 * 改阴影位置
 * 跟前面的材质同理
 * @param {*} shader 
 */
depthMaterial.onBeforeCompile = (shader) =>
{
    shader.uniforms.uTime = customUniforms.uTime
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>

            float angle = (position.y + uTime) * 0.1;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.xz;
        `
    )
}



/**
 * Models
 */
gltfLoader.load(
    '/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) =>
    {
        // Model
        const mesh = gltf.scene.children[0]
        mesh.rotation.y = Math.PI * 0.5
        // mesh.material = depthMaterial
        mesh.material = material
        // 加载模型时要使用自定义的深度网格材质depthMaterial：
        mesh.customDepthMaterial = depthMaterial // Update the depth material
        scene.add(mesh)

        // Update materials
        updateAllMaterials()
    }
)
/**
 * plane 查看阴影情况
 * 网格材质将被深度网格材质MeshDepthMaterial所替代，而我们并没有修改MeshDepthMaterial。
 * 在后边加一个平面可以将看清楚阴影：
 */
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(15,15,15),
    new THREE.MeshStandardMaterial()
)
plane.rotation.y = Math.PI;
plane.position.y = -5;
plane.position.z = 5; 
scene.add(plane);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
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
camera.position.set(4, 1, - 4)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.useLegacyLights = false
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update material
    customUniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()