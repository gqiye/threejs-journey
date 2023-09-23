import EventEmitter from "./EventEmitter.js"

export default class Sizes extends EventEmitter {
    constructor() {
        //继承类的话需要
        super();
        //setuup
        this.width = window.innerWidth
        this.height = window.innerHeight
        // 像素比例
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // 重置事件
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            // 监听到事件之后抛出事件
            this.trigger('resize')

        })
    }
}