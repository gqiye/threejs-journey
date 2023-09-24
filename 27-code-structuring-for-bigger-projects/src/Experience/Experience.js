import * as THREE from 'three'
import Sizes from "./Utlis/Sizes.js";
import Time from "./Utlis/Time.js";
import World from "./World/World.js";
import Camera from "./Camera.js";
import Renderer from './Renderer.js';
import Resources from './Utlis/Resources.js';
import Debug from './Utlis/Debug.js';
import sources from './sources.js';

let instance = null
export default class Experience
{
    constructor(canvas){
        // 为了解决 其他类新建类 Experience 获取其中数据
        // Camera 调用这个函数 Experience 会形成死循环
        // 因此第二次调用的时候就应该判定不让继续下去调用camera函数
        if(instance){
            return instance
        }
        instance = this;

        // global access
        window.experience = this;

        // option 
        this.canvas = canvas

        /**
         * 调试
         */
        this.debug = new Debug()

        /**
         * 尺寸更新
         */
        this.sizes =new Sizes()
        // 接受sizes抛出事件
        this.sizes.on('resize',()=>{
            // 接收size里面抛出的事件
            console.log("i heard  a resize")
            // 触发类里面的函数,维持上下文的this
            this.resize()
        })

        /**
         * 时间
         */
        this.time = new Time()
        this.time.on('tick',()=>{
            // console.log("i heard  tick")
            this.update()
        })

        /**
         * THREE 
         */
        // 场景
        this.scene = new THREE.Scene()
        /**
         * 资源
         */
        this.resources = new Resources(sources)

        /**
         * 照相机
         */
        
        this.camera = new Camera()
        
        /**
         * 几何
         */
        this.world = new World()

        /**
         * 渲染器
         */
        this.renderer = new Renderer()

    }
    // 重置
    resize(){
        console.log("a resize occured")
        this.camera.resize()
        this.renderer.resize()
        
    }
    // 更新
    update(){
        // console.log('update')
        this.camera.update()
        this.world.update()
        this.renderer.update()

    }
    // 销毁
    destroy(){
        this.sizes.off('resize')
        this.time.off('tick')
        // 遍历场景里面的元素进行销毁 dispose 官网
        this.scene.traverse((child)=>{
            if (child instanceof THREE.Mesh) {
                // 销毁网格里面的
                child.geometry.dispose()
                for (const key in child.material) {
                    if (Object.hasOwnProperty.call(child.material, key)) {
                        const value = child.material[key];
                        if (value && typeof value.dispose === 'function' ) {
                            value.dispose()
                        }
                    }
                }
            }
        })
        this.camera.controls.dispose()
        this.renderer.renderInstance.dispose();
        if(this.debug.active){
            this.debug.ui.destroy()
        }
    }
    
}