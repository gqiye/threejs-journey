import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

/**
 * Base
 */
// Debug
const debugObject ={}
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
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

debugObject.portalColorStart = '#000000';
debugObject.portalColorEnd = '#ffffff'

gui
.addColor(debugObject ,'portalColorStart').onChange(()=>{
    portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart )
})
gui.addColor(debugObject,'portalColorEnd').onChange(()=>{
    portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorEnd)
})

// Portal light material
const portalLightMaterial = new THREE.ShaderMaterial({
    uniforms:{
        uTime:{value:0},
        uColorStart:{value:new THREE.Color(debugObject.portalColorStart)},
        uColorEnd:{value : new THREE.Color(debugObject.portalColorEnd)}

    },
    vertexShader:portalVertexShader,
    fragmentShader:portalFragmentShader,
})



/**
 * Model
 */
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        scene.add(gltf.scene)

        // Get each object
        const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

        // Apply materials
        bakedMesh.material = bakedMaterial
        portalLightMesh.material = portalLightMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
    }
)
/**
 * 萤火虫
 */
// 几何体
const firefliesGeometry = new THREE.BufferGeometry();
// 数量
const firefliesCount =30
const positionArray = new Float32Array(firefliesCount * 3);
// 大小
const scaleArray = new Float32Array(firefliesCount * 1);


for (let i = 0; i < firefliesCount; i++) {
    positionArray[i*3+0]=(Math.random()-0.5)*4;
    positionArray[i*3+1]=Math.random()*1.5;
    positionArray[i*3+2]=(Math.random()-0.5)*4;
    scaleArray[i] = Math.random();
}
firefliesGeometry.setAttribute('position',new THREE.BufferAttribute(positionArray,3))
firefliesGeometry.setAttribute('aScale',new THREE.BufferAttribute(scaleArray,1))
// 点的物料
const firefilesMaterial = new THREE.ShaderMaterial({
    uniforms:{
        uTime:{value:0},
        uPixelRatio:{value:Math.min(window.devicePixelRatio, 2)},
        uSize:{value:100}
    },
    vertexShader:firefliesVertexShader,
    fragmentShader:firefliesFragmentShader,
    transparent:true,
    // 添加剂?? 作用萤火虫颜色融合更好,性能略有影响
    blending:THREE.AdditiveBlending,
    // 萤火虫的边缘透明度影响并不会真的消失,物体重叠时候会遮挡后面的光点
    // Gpu 渲染的时候前面有东西遮挡后面的东西不渲染,禁止之后遮挡的会被渲染
    // depthWrite：渲染此材质是否对深度缓冲区有任何影响。默认为true
    // depthTest：是否在渲染此材质时启用深度测试。默认为 true。
    depthWrite:false, // 不遮挡后面的模型
})

//debug
gui.add(firefilesMaterial.uniforms.uSize,'value').min(0).max(500).step(1).name('萤火虫大小')


// 添加到场景
const fireFiles = new THREE.Points(firefliesGeometry,firefilesMaterial)
scene.add(fireFiles)


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

    // update fireFiles
    console.log(firefilesMaterial.uniforms)
    firefilesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
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

debugObject.clearColor = '#d7acac';
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject,'clearColor').onChange(()=>{
    renderer.setClearColor(debugObject.clearColor)
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // 更新时间
    firefilesMaterial.uniforms.uTime.value = elapsedTime;
    portalLightMaterial.uniforms.uTime.value = elapsedTime;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()