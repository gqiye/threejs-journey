import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor'
import Fox from './Fox'



export default class Camera {
    constructor(){

        this.experience = new Experience()

        this.scene= this.experience.scene
        this.resources = this.experience.resources
        

        //mesh  正方体
        // const testMesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(1,1,1),
        //     new THREE.MeshStandardMaterial()
        // )
        // this.scene.add(testMesh)



        // 等待资源加载完成
        this.resources.on('loaded',()=>{
            console.log('loaded')
            //setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
            
        })

        //setup
        // this.environment = new Environment()
    }
    update(){
        if (this.fox) {
            this.fox.update()
        }
    }

}