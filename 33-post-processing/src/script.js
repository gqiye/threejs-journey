import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
// 效果合成器EffectComposer会处理创建渲染目标，进行乒乓缓冲将上个通道的纹理发送到当前通道，在画布上绘制最终效果等全部过程。
// https://threejs.org/docs/index.html?q=po#examples/en/postprocessing/EffectComposer
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// RenderPass的通道类，这个通道负责场景的第一次渲染，它会在EffectComposer内部创建的渲染目标中进行渲染，而非画布上
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// DotScreenPass  通道 黑白光栅效果
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
// GlitchPass 通道   屏幕被入侵时的效果
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
// RGBShift通道
// RGBShift没法用作通道但是可以用作着色器，因此我们要引入该着色器RGBShiftShader并将其应用于ShaderPass，
// 然后将着色器通道ShaderPass添加到效果合成器中。
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
// Bloom敷霜辉光效果到渲染中，它对重现光热、激光、光剑或放射性物质非常有用。
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

// 抗鋸齒
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';

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
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
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
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
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
// 因此颜色较深
// renderer.outputEncoding = THREE.SRGBEncoding 不再起作用，因为我们在渲染目标内部渲染，而那些渲染目标不支持编码
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.useLegacyLights = false
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * 效果合成器可以提供我们自己的renderTarget作为第二个参数。
 * 前俩个参数是宽和高，这里可以随便给值，因为效果合成器会在调用 setSize(...)方法时重新调整renderTarget的尺寸。
 * 第三个参数是个对象，可以从Three.js效果合成器源码中复制那个对象，然后我们再自己添加一个encoding属性，值为THREE.sRGBEncoding

 */
// 抗锯齿处理 https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer.capabilities
// https://caniuse.com/webgl2 浏览器兼容性
// let RenderTargetClass = null

// if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
// {
    // const smaaPass = new SMAAPass()
    // effectComposer.addPass(smaaPass)

    // console.log('Using SMAA')
//     RenderTargetClass = THREE.WebGLMultisampleRenderTarget
//     console.log('Using WebGLMultisampleRenderTarget')
// }
// else
// {
//     RenderTargetClass = THREE.WebGLRenderTarget
//     console.log('Using WebGLRenderTarget')
// }

// const renderTarget = new THREE.WebGLRenderTarget(
//     800,
//     600,
//     {
//         minFilter: THREE.LinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBAFormat,
//         // 这个参数在renderTarget中没有,是否使用前后无变化,不知道是否是该属性名
//         // https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderTarget
//         encoding: THREE.SRGBColorSpace
//     }
// )
// 该种模式renderTarget 并不能在此让那个环境变亮,具体原因未知
// const effectComposer = new EffectComposer(renderer, renderTarget)
/**
 * Post processing
 * 参数一 将渲染器作为参数传进去。
 * 参数二 渲染目标renderTarget是由带有特定参数的WebGLRenderTarget创建而成的。https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderTarget
 * 与WebGLRenderer一样，我们需要使用setPixelRatio（…）提供像素比率
 * 并使用setSize（…）调整其大小，下边将使用与渲染器相同的参数：
 * 
 * 注意点
 * 由于使用的是 EffectComposer，因此颜色较深
 * renderer.outputEncoding = THREE.SRGBEncoding 不再起作用，因为我们在渲染目标内部渲染，而那些渲染目标不支持编码
 */
const effectComposer = new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)


// 将场景和相机作为参数传给RenderPass，实例化第一个通道，并使用addPass()方法将通道加到效果合成器中
// renderPass通道
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// DotScreenPass 通道
const dotScreenPass = new DotScreenPass()
// 禁用通道，只要设置通道的enabled属性为false：
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// GlitchPass会添加一种屏幕故障效果
const glitchPass = new GlitchPass()
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

// 传入RGBShiftShader并实例化ShaderPass，添加到effectComposer：
const rgbShiftPass = new ShaderPass(RGBShiftShader)
// rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

// 让画面变亮通道跟RGBShiftShader搭配使用,让画面不昏暗
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
// gammaCorrectionPass.enabled = false
effectComposer.addPass(gammaCorrectionPass)

/**
 * 抗锯齿解决方案
 * 如果屏幕像素比大于1，我们将使用WebGLRenderTarget，不使用抗锯齿通道
 * 如果屏幕像素比为1，并且浏览器支持WebGL 2，使用WebGLMultisampleRenderTarget(WebGLMultisampleRenderTarget在r138版本中已被移除)
 * 如果屏幕像素比为1，并且浏览器不支持WebGL 2，使用WebGLRenderTarget并且采用 SMAAPass
 * 
 * 抗锯齿通道
 * FXAA：性能良好，但结果也只是良好，可能会导致模糊
 * SMAA：效果比FXAA好，但同时性能也消耗大（不要与MSAA搞混了）
 * SSAA：质量最好，但性能最差
 * TAA：性能良好但结果有限
 */
const smaaPass = new SMAAPass()
smaaPass.enabled = false
effectComposer.addPass(smaaPass)

// 抗鋸齒效果確實很好，但是电脑都跑出异响,确实性能消耗大
const sassRenderPass = new SSAARenderPass(scene, camera)
effectComposer.addPass(sassRenderPass )


/**
 * 光剑特效
 */
const unrealBloomPass = new UnrealBloomPass()
// unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)
// strength：光的强度
// radius:亮度的发散半径
// threshold:限制物体开始发光的亮度值
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6

gui.add(unrealBloomPass, 'enabled')
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)

/**
 * 创建自己的通道
 */
const TintShader = {
    uniforms:
    {
        // 要从上一个通道中获得贴图纹理，这个纹理自动存储在名为 tDiffuse的unifom中。
        // 必须将这个unifom的值设为null，效果合成器会更新它，然后在片元着色器检索该uniform：
        tDiffuse: { value: null },
        // 注意，我们将该值设为null。
        // 创建一个名为uTint的uniform来控制颜色变化，在片元着色器中检索并设置
        // 不要直接在着色器对象中设置值，必须在创建完通道后，再去材质中修改值，因为着色器会被多次使用，即便没使用到也一样。
        uTint: { value: null }
    },
    vertexShader: `
    // 创建并在片元着色器接收来自顶点着色器的UV坐标变量vUv
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;
        varying vec2 vUv;

        void main()
        {
            // sampler2D（一个贴图纹理）中获取像素，需要用 texture2D(...)方法，它接收贴图纹理作为第一个参数，UV坐标作为第二个参数。
            vec4 color = texture2D(tDiffuse, vUv);
            // 改颜色
            color.rgb += uTint;
            gl_FragColor = vec4(color);
        }
    `
}
const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)

gui.add(tintPass.material.uniforms.uTint.value, 'x').min(- 1).max(1).step(0.001).name('red')
gui.add(tintPass.material.uniforms.uTint.value, 'y').min(- 1).max(1).step(0.001).name('green')
gui.add(tintPass.material.uniforms.uTint.value, 'z').min(- 1).max(1).step(0.001).name('blue')

/**
 * 位移通道
 * UV来产生位移效果。
 * 跟创建着色通道一样，创建一个名为DisplacementShader的着色器，实例化这个着色器通道，添加到效果合成器中：
 */
const DisplacementShader = {
    uniforms:
    {
        tDiffuse: { value: null },
        uTime: { value: null },
        uNormalMap: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;

        void main()
        {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        // 蜂巢效果
        void main()
        {
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = color;
        }

        // 扭曲波动效果
        // void main()
        // {
        //     // 基于vUv创建一个带扭曲的newUv，在基于x轴的y轴上用了sin函数：
        //     vec2 newUv = vec2(
        //         vUv.x,
        //         vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
        //     );
        //     vec4 color = texture2D(tDiffuse, newUv);


        //     gl_FragColor = color;
        // }
    `
}

const displacementPass = new ShaderPass(DisplacementShader)
displacementPass.material.uniforms.uTime.value = 0
// 加载完贴图后更新uNormalMap值：
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
effectComposer.addPass(displacementPass)

/**
 * 蜂巢
 */

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

     // Update passes
     displacementPass.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    // 使用效果合成器effectComposer来进行渲染，而非以往的渲染器渲染：
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()