import * as THREE from 'three'
import Experience from "../Experience";



export default class Environment {
    constructor(){

        this.experience = new Experience()

        this.scene= this.experience.scene
        this.resources = this.experience.resources
        this.debug =this.experience.debug
        // debug
        if(this.debug.active){
            this.debugFolder = this.debug.ui.addFolder('environment')
        }
        //太阳光
        this.setSunLight()
        // 环境
        this.setenvironmentMap()
    }
    setSunLight(){
        this.sunLight = new THREE.DirectionalLight('#ffffff', 1)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)
                // debug
        if (this.debug.active) {
            this.debugFolder
            .add(this.sunLight, 'intensity')
            .name('sunLightIntensity')
            .min(0)
            .max(10)
            .step(0.001)
            this.debugFolder
            .add(this.sunLight.position, 'x')
            .name('sunLightX')
            .min(-5)
            .max(5)
            .step(0.001)
            this.debugFolder
            .add(this.sunLight.position, 'y')
            .name('sunLightY')
            .min(-5)
            .max(5)
            .step(0.001)
            this.debugFolder
            .add(this.sunLight.position, 'z')
            .name('sunLightZ')
            .min(-5)
            .max(5)
            .step(0.001)
        }
    }
    setenvironmentMap(){
        this.environmentMap = {}
        // 强度
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
        // 有一种更简单的方法将环境贴图应用到所有对象上，
        // 我们可以像更改场景的background属性一样去更改场景的environment属性。
        // 这样做的话就不必再在updateAllMaterials函数中去设置环境贴图了。
        // 但是我们仍然无法直接从场景里更改每个材质的环境贴图强度，因此还是需要updateAllMaterials函数。
        this.scene.environment = this.environmentMap.texture
        // 加载的时候过快可能贴图会出现bug,更新一下贴图
        this.environmentMap.updateMaterials = () =>{
            this.scene.traverse((child)=>{
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                    // child.castShadow = true
                    // child.receiveShadow = true
                }
            })
        }
        this.environmentMap.updateMaterials()

        // debug
        if (this.debug.active) {
            this.debugFolder
            .add(this.environmentMap, 'intensity')
            .min(0)
            .max(4)
            .step(0.001)
            .onChange(this.environmentMap.updateMaterials)
        }
    

    }

}