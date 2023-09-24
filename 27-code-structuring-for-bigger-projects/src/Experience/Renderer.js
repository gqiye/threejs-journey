import * as THREE from 'three'
import Experience from "./Experience.js";

export default class Renderer{
    constructor() 
    {
        this.experience = new Experience()
        
        this.sizes= this.experience.sizes
        this.scene= this.experience.scene
        this.canvas= this.experience.canvas
        this.camera= this.experience.camera
        // console.log('Renderer')
        this.setInstance()
    }
    setInstance()
    {
        this.renderInstance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        // this.renderInstance.useLegacyLights = false
        this.renderInstance.toneMapping = THREE.CineonToneMapping
        this.renderInstance.toneMappingExposure = 1.75
        this.renderInstance.shadowMap.enabled = true
        this.renderInstance.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderInstance.setClearColor('#211d20')
        this.renderInstance.setSize(this.sizes.width, this.sizes.height)
        this.renderInstance.setPixelRatio(this.sizes.pixelRatio)
        // console.log(this.canvas)
    }
    resize(){
        this.renderInstance.setSize(this.sizes.width, this.sizes.height);
        this.renderInstance.setPixelRatio(this.sizes.pixelRatio)
    }
    update(){
        this.renderInstance.render(this.scene,this.camera.cameraInstance)
    }
}