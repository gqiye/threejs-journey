import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width:300})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy 星系
 */
const parameters = {
    // 个数
    count:10000,
    // 尺寸
    size:0.01,
    // 稀疏
    radius:5,
    // 分支
    braches:3,
    // 旋转
    spin:1,
    // 随机性
    randomness:0.2,
    // 随机性的pow函数,计算,中间多,两端少
    randomnessPower:3,
    // 里面颜色
    insideColor:'#ff6030',
    // 外面颜色
    outsideColor:'#1b3984'

}

// 移出函数 变量提升 
// 在函数内重新生成一个局部函数,之前的变量数据并没有删除
let geometry = null;
let material = null;
let points = null;



const generateGalaxy = ()=>{

    /**
     * 性能优化,删除旧的缓存数据
     */
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }


    /**
     * Geometry 几何图形
     */
     geometry = new THREE.BufferGeometry()
    // 生成3000个值为0的数组
    const positions = new Float32Array(parameters.count * 3)
    // 新增一个数据存颜色
    const colors = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i*3;
        //半径 稀疏程度
        const radius = Math.random() * parameters.radius;
        // 每个点有一定的程度进行偏移旋转
        const spinAngle = radius * parameters.spin
        // 计算分支情况 在圆圈里面均匀分布 第几天分支除以总分支eg 1/3 乘以圆周律
        const brachAngle = (i % parameters.braches) / parameters.braches * Math.PI * 2

        // -0.5 在x,y,z 以中点左右分布
        // * parameters.randomness 随机程度 在x,y,z轴的范围变广,而不是限定一个值
        // const randomX = (Math.random() - 0.5) * parameters.randomness;
        // const randomY = (Math.random() - 0.5) * parameters.randomness;
        // const randomZ = (Math.random() - 0.5) * parameters.randomness;

        // 加上pow函数,处理,让数据中间部分集中,两边少,幂函数
        // (Math.random() < 0.5 ?1 :-1) 随机给一半赋予正负值
        const randomX = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5 ?1 :-1);
        const randomY = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5 ?1 :-1);
        const randomZ = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() < 0.5 ?1 :-1);

        // 曲线分布
        // 直线 分支分布
        // x
        // positions[i3] =  Math.cos(brachAngle)*radius
        // // y
        // positions[i3+1] = 0
        // // z
        // positions[i3+2] =Math.sin(brachAngle)*radius

        // x
        positions[i3] =  Math.cos(brachAngle + spinAngle) * radius + randomX 
        // y
        positions[i3+1] = randomY
        // z
        positions[i3+2] =Math.sin(brachAngle + spinAngle) * radius + randomZ 

        /**
         * color
         */
        //颜色获取需要新建一个Color类
        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);
        // 复制,不影响原数组
        const mixedColor = colorInside.clone();
        /**
         * lerp 函数 两个颜色的混合
         * 参数一 颜色
         * 参数二 alpha 差值因子 混合程度
         * 将此颜色的 RGB 值线性插值到传递参数的 RGB 值。alpha 参数可以被认为是两种颜色之间的比率，其中0.0是该颜色，1.0是第一个参数
         */
        //radius 0 - 4  随机值
        // 0 靠近 原本颜色 colorInside  越大越靠近融合颜色 colorOutside
        mixedColor.lerp(colorOutside,radius)
        // r,g,b
        colors[i3] = mixedColor.r
        colors[i3+1] = mixedColor.g
        colors[i3+2] = mixedColor.b
    }
    // 设置点的位置
    geometry.setAttribute('position', 
    // 顶点数组 ,顶点个数
    new THREE.BufferAttribute(positions,3))

    // 设置颜色
    geometry.setAttribute('color', 
    // 顶点数组 ,顶点个数
    new THREE.BufferAttribute(colors,3))

    /**
     * Material 材质
     */
    material = new THREE.PointsMaterial({
        size:parameters.size,
        // 指定点的大小是否因相机深度而衰减。（仅限透视相机。默认值为 true。
        sizeAttenuation:true,
        // 渲染此材质是否对深度缓冲区有任何影响。默认值为 true 
        // 绘制 2D 叠加时，禁用深度写入以将多个内容分层在一起而不会创建 z 索引伪影非常有用。
        depthWrite:false,
        // 使用此材质显示对象时要使用的混合
        // 混合模式 必须将其设置为自定义混合才能使用自定义blendSrc，blendDst或blendEquation。
        // 添加剂混合
        blending:THREE.AdditiveBlending,
        // 颜色多个调整
        vertexColors:true,
        // color:'red'
    });
    // 
    /**
     * Point 点  
     * 用于显示点的类
     */
    points = new THREE.Points(geometry,material)
    scene.add(points)
    
}

generateGalaxy()
/**
 * gui 控制
 */
gui.add(parameters,'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'braches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

 
/** 
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

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
camera.position.z = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()