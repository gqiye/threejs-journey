import Experience from "./Experience";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor(){
        /**
         * 传递参数有三种方法
         * 1. 直接在父函数用参数传递
         * 2. 全局变量
         * 3. 新建一个对象获取(复杂)以下就是
         */
        this.experience = new Experience()

        this.sizes= this.experience.sizes
        this.scene= this.experience.scene
        this.canvas= this.experience.canvas

        // 设置照相机实例
        this.setInstance()
        // console.log(this.experience)
        // 设置轨道
        this.setOrbitControls()

    }
    setInstance(){
        this.cameraInstance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.cameraInstance.position.set(6, 4, 8)
        this.scene.add(this.cameraInstance)
    }
    setOrbitControls(){
        this.controls = new OrbitControls(this.cameraInstance, this.canvas)
        this.controls.enableDamping = true
    }
    // 重置
    resize(){
        console.log('resize on the camera')
        this.cameraInstance.aspect = this.sizes.width / this.sizes.height
        this.cameraInstance.updateProjectionMatrix()
    }
    // 更新
    update()
    {
        this.controls.update()
    }
}