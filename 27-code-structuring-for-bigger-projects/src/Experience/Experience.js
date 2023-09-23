import Sizes from "./Utlis/Sizes";
import Time from "./Utlis/Time";

export default class Experience
{
    constructor(canvas){
        // global access
        window.experience = this;

        // option 
        this.canvas = canvas

        // setup
        this.sizes =new Sizes()
        // 接受sizes抛出事件
        this.sizes.on('resize',()=>{
            // 接收size里面抛出的事件
            console.log("i heard  a resize")
            // 触发类里面的函数,维持上下文的this
            this.resize()
        })

        // 时间
        this.time = new Time()
        this.time.on('tick',()=>{
            // console.log("i heard  tick")
            this.update()
        })

    }
    // 重置
    resize(){
        console.log("a resize occured")
        
    }
    // 更新
    update(){
        // console.log('update')
    }
}