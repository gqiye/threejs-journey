import EventEmitter from "./EventEmitter.js"

export default class Time extends EventEmitter {
    constructor() {
        //继承类的话需要
        super();
        
        //setup
        this.start = Date.now();
        this.current= this.start;
        this.elapsed = 0;
        // 默认60帧,每帧16ms ,0 会出现莫名其妙的bug
        this.delta =16
        
        // 先运行一帧再刷新
        window.requestAnimationFrame(()=>{
            this.tick()
        })
        
    }

    // 帧数时钟
    tick(){
        // 获取计算机帧数
        const currentTime = Date.now()
        // 每一帧两个时间戳的差,即一帧经过多少ms
        this.delta = currentTime - this.current
        this.current = currentTime
        // 经过的时间
        this.elapsed = this.current - this.start
        // console.log(this.delta )
        //抛出事件
        this.trigger('tick')

        window.requestAnimationFrame(()=>{
            this.tick()
        })
    }
}