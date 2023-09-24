import * as THREE from 'three'
import Experience from "../Experience";




export default class Fox {
    constructor(){

        this.experience = new Experience()

        this.scene= this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug =this.experience.debug
        // debug
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        this.resource = this.resources.items.foxModel

        this.setModel()
        this.setAnimation()
    }
    setModel(){
        this.model = this.resource.scene
        this.model.scale.set(0.02,0.02,0.02);
        this.scene.add(this.model)
        this.model.traverse((child)=>{
            if (child instanceof THREE.Mesh) {
                child.castShadow =true
            }
        })
    }
    setAnimation(){
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        // 不同动画效果
        this.animation.actions = {}
        this.animation.actions.idle =this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking=this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running =this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()
        // this.animation.actions.walking.play()
        
        // 动作过渡
        this.animation.play = (name)=>{
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current
            
            newAction.reset()
            newAction.play()
            // 过渡动作 参数一 旧动作 参数二 过渡时间
            newAction.crossFadeFrom(oldAction,1)

            this.animation.actions.current = newAction
        }
        //debug
        if (this.debug.active) {
            const debugObject = {
                playIdle: ()=>{ this.animation.play('idle')},
                playWalking: ()=>{ this.animation.play('walking')},
                playRunning: ()=>{ this.animation.play('running')},
            }
            this.debugFolder.add(debugObject,'playIdle')
            this.debugFolder.add(debugObject,'playWalking')
            this.debugFolder.add(debugObject,'playRunning')
        }
    }
    update(){
        // console.log('动作更新')
        this.animation.mixer.update(this.time.delta *0.001)
    }

}