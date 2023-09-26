import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl?raw'
import testFragmentShader from './shaders/test/fragment.glsl?raw'
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// 1024*1024
const flagTexture = textureLoader.load('/textures/flag-french.jpg')


/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
const count = geometry.attributes.position.count
const randoms = new Float32Array(count)
for(let i = 0; i < count; i++)
{
    randoms[i] = Math.random()
}
// 第一个参数是我们设置的attribute属性的名字 第一个参数是数据数组
// 第二个参数是组成一个属性的值的数量 如果我们要发送一个位置，我们会使用3，因为位置由3个值（x、y和z）组成。但在这里，每个顶点只有1个随机值，所以我们使用1。
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material
// 我们在其他材质中介绍的大多数常见属性（如wireframe、side、transparent、flatShading）
// 仍然适用于RawShaderMaterial
// 但是像map、alphaMap、opacity、 color等属性将不再生效，
// 因为我们需要自己在着色器中编写这些特性。
const material = new THREE.RawShaderMaterial({
/***
 *     // 有内置attributes和uniforms，精度也会自动设置。
 * const material = new THREE.ShaderMaterial({
 * 然后在着色器中移除下面这些uniform，attribute和precision：

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec3 position;
attribute vec2 uv;
precision mediump float;
之后着色器会跟之前一样正常运行，因为它会自动添加上上面这些。
 *  */ 

    vertexShader:testVertexShader,
    fragmentShader:testFragmentShader,
    // 降低alpha值使能够看出差异
    // transparent: true
    // 统一变量uniform是将数据从JavaScript发送到着色器的一种方式。两个着色器中都可以使用
    uniforms:
    {
        // uFrequency: { value: 15 }
        // 把频率frequency改为vec2来控制水平和垂直方向的波
        uFrequency: { value: new THREE.Vector2(10, 5) },
        // 着色器发送一个时间值，并在sin函数中使用
        uTime: { value:0 },
        // Three.js的Color作为新的统一变量
        uColor: { value: new THREE.Color('orange') },
        // 传递纹理图片
        uTexture: { value: flagTexture }
    }
})

gui.add(material.uniforms.uFrequency.value, 'x')
	.min(0)
	.max(20)
	.step(0.01)
	.name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y')
	.min(0)
	.max(20)
	.step(0.01)
	.name('frequencyY')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

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
camera.position.set(0.25, - 0.25, 1)
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
    // 使用uTime时要注意，如果我们使用原生JavaScript的Date.now()，
        // 你会发现不起作用，因为它返回的数值对于着色器而言太过庞大了。注意，我们不能发送太小或太大的统一变量值。
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()