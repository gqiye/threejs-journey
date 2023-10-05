import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

// 位置不知道怎么确定`的
// position：用来存放3D位置坐标
// element: 从HTML获取对应点元素的节点
// https://blog.csdn.net/weixin_40856652/article/details/125302743

const points = [
    {
        position: new THREE.Vector3(1.55, 0.3, - 0.6),
        element: document.querySelector('.point-0')
    },
    {
        position: new THREE.Vector3(0.5, 0.8, - 1.6),
        element: document.querySelector('.point-1')
    },
    {
        position: new THREE.Vector3(1.6, - 1.3, - 0.7),
        element: document.querySelector('.point-2')
    }
]


// 光线投射
// https://threejs.org/docs/#api/zh/core/Raycaster
const raycaster = new THREE.Raycaster()

/**
 * Loaders
 */
let sceneReady = false

const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {

        window.setTimeout(() =>
        {
            sceneReady = true
        }, 2000)
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''

            // sceneReady = true
        }, 500)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
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

environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2.5, 2.5, 2.5)
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
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
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
renderer.useLegacyLights = false
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    
    // Update controls
    controls.update()
    if(sceneReady)
    {
    // 遍历每个点
    for(const point of points)
    {
        // 根据场景中点的3D坐标来获取点在屏幕上的二维坐标。
        // 使用clone()方法克隆点的位置得到screenPosition
        // 让点跟随头盔移动
        const screenPosition = point.position.clone();
        // 对screenPosition调用project(...) 方法并传入摄像机camera作为参数
        // 该点的x坐标，可以看到其值非常接近于0。按住右键把头盔拖往屏幕左侧，值将接近-1，拖往屏幕右侧，值将接近+1。
        screenPosition.project(camera)

        // 要让射线从摄像机发射到对应点，需要调用setFromCamera(...)方法
        // 第一个参数是对应点在屏幕上的二维坐标，
        // 第二个参数则是射线来源的相机。
        // screenPosition是一个Vector3，但是我们只用到他的x和y属性
        raycaster.setFromCamera(screenPosition, camera)
        // intersectObject(...)方法来检查与射线相交的物体
        // 第一个是scene.children，场景中所有物体
        // 第二个参数为true代表开启递归测试，会递归遍历物体的子代。
        // intersectObjects(...)方法会返回一个相交对象数组，这些对象会按照距离排序
        // console.log(scene.children)
        const intersects = raycaster.intersectObjects(scene.children, true)

        /**
         * 判断点是否显示
         * 从摄像机发射一条射线到对应点，如果没有东西与射线相交，则显示该点,
         * 若有东西与射线相交，则计算与该交点的距离，如果交点比点元素距离更远，
         * 则说明点元素在交点前面，继续显示，
         * 如果交点离摄像机距离更近，则说明点元素被覆盖住了，要移除visible样式将点给隐藏起来。
         * 先判断射线是否有相交物体，没有的话则添加visible类显示该点，若有相交物体，再做后续其他判断
         */
        // 先判断射线是否有相交物体，没有的话则添加visible类显示该点，若有相交物体，再做后续其他判断
        if(intersects.length === 0)
        {
            point.element.classList.add('visible')
        }
        else
        {
            // intersectObjects(...)方法会返回一个相交对象数组，这些对象会按照距离排序，
            // 这也就意味着我们无需去测试全部相交对象，只需要测试第一个便可，
            // 通过distance属性获取距离值。
            // 然后通过distanceTo(...)方法传入相机位置，获取点元素到相机的距离值。
            // 接着比较两个值大小，决定点元素的显隐：

            // 物体到相机距离
            const intersectionDistance = intersects[0].distance
            // 点到相机距离
            const pointDistance = point.position.distanceTo(camera.position)
			if(intersectionDistance < pointDistance)
            {
                point.element.classList.remove('visible')
            }
            else
            {
                point.element.classList.add('visible')
            }
        }


        //接下去要把这个坐标转换成像素值，因为要根据像素值去改变页面元素的位置。
        // 要把场景中的点坐标转换为屏幕中的像素，需要乘以渲染器尺寸的一半：
        const translateX = screenPosition.x * sizes.width * 0.5
        // y轴下方代表正值，而在Three.js中则是普通的坐标系y轴上方代表正值，因此translateY要取反
        const translateY = - screenPosition.y * sizes.height * 0.5
        // 更新元素的transform属性，在x轴上平移了translateX个像素,y轴同理，
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`        
        console.log(translateX)
    }
}

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()