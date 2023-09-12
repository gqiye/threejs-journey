import * as THREE from 'three'
import './style.css'
import * as dat from 'dat.gui'

// three 控制类 引入轨道控制函数
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

console.log(OrbitControls)

/**
 * 鼠标移动事件 cursor
 */
const cursor = {
    x:0,
    y:0
}

window.addEventListener('mousemove',(event)=>{
    //场景 鼠标到边界趋近 -0.5 到 0.5 
    cursor.x = event.clientX/sizes.width -0.5;
    cursor.y=event.clientY / sizes.height -0.5;
})


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// 控制每一个面有多少个面组成
// const geometry = new THREE.BoxGeometry(1, 1, 1,2,3,4)
// 数组 , 浮点数
// 参数 数组长度为多少
// const positionArray = new Float32Array(9)
// positionArray[0]=0;
// positionArray[1]=0;
// positionArray[2]=0;
// positionArray[3]=0;
// positionArray[4]=1;
// positionArray[5]=0;
// positionArray[6]=1;
// positionArray[7]=0;
// positionArray[8]=0;
const positionArray = new Float32Array([
    0,0,0,
    0,1,0,
    1,0,0
])
// 如果这个属性存储一个3组件向量(比如位置、法线或颜色)，那么itemSize应该是3
const positionAttribute = new THREE.BufferAttribute(
    positionArray,3
)
// 增加一个空的缓存几何图形
const geometry = new THREE.BufferGeometry()
// 将这个几何图形的图像进行设置
geometry.setAttribute('position',positionAttribute)

const material = new THREE.MeshBasicMaterial({
     color: 0xff0000,
    wireframe:true
    })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// 画面移动的时候进行适应
window.addEventListener('resize',()=>{
    //update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight
    // 更新相机
    camera.aspect =sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // 更新渲染
    renderer.setSize(sizes.width, sizes.height)
    // 兼容切换不同屏幕的时候像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
// 监听双击事件切换全屏
window.addEventListener('dblclick',()=>{
    // 兼容 大概.. 加上wikit  safari兼容
    // wikitFullscreenElement
    // wikitRequestFullscreen
    // wikitExitFullscreen
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

// Camera
// 视野,宽/高,近(两个物体太近会有重叠问题),远(镜头到物体的远)
const camera = new THREE.PerspectiveCamera(
    75, sizes.width / sizes.height,1,3.9)

camera.position.set(0,0,3)
camera.lookAt(mesh.position)
scene.add(camera)


// 控制
const controls = new OrbitControls(camera,canvas)
// 阻尼?有个过度动画效果,在tick得调用更新
controls.enableDamping=true;

// 更改控制初始方向
// controls.target.y=1
// controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
// 像素比显示
// window.devicePixelRatio 获取屏幕像素比
// 限制像素比为2
// 设置太高会有性能问题
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


const clock = new THREE.Clock()
// animations 动画
const tick = ()=>{
    // 调用控件
    controls.update();
    renderer.render(scene, camera)
    // windows动画帧,会根据电脑帧数进行适应
    window.requestAnimationFrame(tick)
    // console.log("tick", tick)
}
tick()