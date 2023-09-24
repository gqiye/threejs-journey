import * as THREE from 'three'
import Experience from "../Experience";
// import Environment from './Environment'



export default class Floor {
    constructor(){

        this.experience = new Experience()

        this.scene= this.experience.scene
        this.resources = this.experience.resources
        
        
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }
    setGeometry(){
        this.geometry = new THREE.CircleGeometry(5, 64)
    }
    setTextures(){
        this.textures = {}
        this.textures.color = this.resources.items.grassColorTexture
        // 该属性推导文档 https://threejs.org/docs/index.html#api/en/constants/Textures
        // 结合ai texture.colorSpace = THREE.sRGBEncoding; 和 THREE.SRGBColorSpace = "srgb" 推导,效果正确
        this.textures.color.colorSpace=THREE.SRGBColorSpace
        // 版本更新,下面属性失效
        // this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }
    setMaterial(){
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
    }
    setMesh(){
        this.mesh= new THREE.Mesh(this.geometry,this.material)
        this.mesh.rotation.x =-Math.PI*0.5
        this.mesh.receiveShadow =true
        this.scene.add(this.mesh)
    }
}