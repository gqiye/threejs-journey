import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
/***
 * 用法示例：
    测试相机前方是否有一堵墙（障碍）
    光线是否击中目标
    当鼠标移动时测试是否有物体位于光标下方，以此模拟鼠标事件
    当物体朝向特定某处时提示信息
 */
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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * RayCaster
 * 创建光线投影
 * Raycaster( origin : Vector3, direction : Vector3, near : Float, far : Float )
 * origin —— 光线投射的原点向量。
 * direction —— 向射线提供方向的方向向量，应当被标准化（单位向量化.normalize()）。
 * near —— 返回的所有结果比near远。near不能为负值，其默认值为0。
 * far —— 返回的所有结果都比far近。far不能小于near，其默认值为Infinity（正无穷）
 */
const raycaster = new THREE.Raycaster()
// 射线原点
const rayOrigin = new THREE.Vector3(-3,0,0)
//射线方向
const rayDirection = new THREE.Vector3(10,0,0)
// 必须将射线方向三维向量转化为单位向量
// 也就是说，将该向量的方向设置为和原向量相同，但是其长度（length）为1
rayDirection.normalize()
raycaster.set(rayOrigin,rayDirection)
// 投射射线
// 使用Raycaster的intersectObject()方法来测试一个对象，intersectObjects()方法测试一组对象
const intersect = raycaster.intersectObject(object2)
console.log(intersect);
const intersects = raycaster.intersectObjects([object1,object2,object3])
console.log(intersects);
// 查看打印结果对象包含了什么信息
// distance – 光线原点与碰撞点之间的距离
// face – 几何体的哪个面被光线击中
// faceIndex – 那被击中的面的索引
// object – 什么物体与碰撞有关
// point – 碰撞准确位置的矢量
// uv – 该几何体中的UV坐标

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Mouse
 * 可以使用光线投射来测试物体是否在鼠标下面。为此我们需要的是鼠标的坐标，一个在水平轴和垂直轴上范围从-1到1的值。
 * 因为鼠标只在屏幕移动，所以使用二维向量Vector2来创建鼠标变量，并监听鼠标移动事件，获取鼠标位置。
 * 因为需要水平方向由左往右和垂直方向由下往上的值范围始终在[-1,1]的区间内，因此需要对鼠标坐标位置进行标准化。
 */
const mouse = new THREE.Vector2()
// 避免在mousemove事件回调中投射光线，而是要回动画函数中去投射光线。
// 之后使用setFromCamera()方法将光线定向到正确的方向
// .setFromCamera ( coords : Vector2, camera : Camera ) : undefined
// coords —— 在标准化设备坐标中鼠标的二维坐标 —— X分量与Y分量应当在-1到1之间。
// camera —— 射线所来源的摄像机。
window.addEventListener('mousemove', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 -1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1
    // console.log(mouse);
})

/**
 * 鼠标移入移出事件
 * 我们可能有时候有这么一个需求，当鼠标移动到物体上时触发一次鼠标移入事件mouseenter ，
 * 鼠标离开物体时触发一次鼠标移出事件mouseleave，可以在动画函数中添加如下代码：
 * 思路是先在外面定义一个当前鼠标移入对象变量currentIntersect，值为null，
 * 然后对被光线射中的对象数组长度进行判断，如果不为0则说明射线与物体相交了，
 * 在里面判断当前鼠标移入对象的值，为空则触发mouseenter事件，
 * 然后将射线首先照射到的第一个对象赋值给currentIntersect，
 * 后面触发mouseleave事件相信也明白怎么做了。
 */
let currentIntersect =null;

/**
 * 鼠标点击事件
 * 同样借助当前鼠标移入对象变量currentIntersect
 */

// window.addEventListener('click', _event => {
//     if(currentIntersect){
//         console.log('点击了球体');
//     }
// })
// 如果想要知道具体是哪个对象
window.addEventListener('click', _event => {
    if(currentIntersect){
        switch(currentIntersect.object){
            case object1:
                console.log('点击了对象1');
                break
            case object2:
                console.log('点击了对象2');
                break
            case object3:
                console.log('点击了对象3');
                break
        }
    }
})

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
        // 物体动画：上下移动
        object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
        object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
        object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5
    
        //创建射线
        // const rayOrigin = new THREE.Vector3(-3,0,0)
        // const rayDirection = new THREE.Vector3(1,0,0)
        // rayDirection.normalize()
        // raycaster.set(rayOrigin, rayDirection)
        raycaster.setFromCamera(mouse, camera)
    
        // 物体对象数组
        const objectsToTest = [object1,object2, object3]
        // 被射线照射到的一组对象
        const intersects = raycaster.intersectObjects(objectsToTest)
        // 物体平时颜色为红色
        for(const object of objectsToTest){
            object.material.color.set('#ff0000')
        }
        // 被射线照射到的物体颜色变蓝
        for(const intersect of intersects){
            intersect.object.material.color.set('#0000ff')
        }

        // mouse 移入移出
        if (intersects.length) {
            if(currentIntersect==null){
                console.log('mouse enter');
            }
          currentIntersect = intersects[0]
        } else {
            if(currentIntersect){
                console.log('mouse leave');
            }
          currentIntersect = null
        }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()