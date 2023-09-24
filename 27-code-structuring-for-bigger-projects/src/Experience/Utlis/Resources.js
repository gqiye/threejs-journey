import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader.js";
import EventEmitter from "./EventEmitter.js"

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        // 获取资产
        this.sources =sources

        // 更新
        this.items ={}
        this.toLoad = this.sources.length
        this.loaded = 0
        // 设置加载器
        this.setLoaders()
        // 加载
        this.startLoading()
    }
    setLoaders(){
        this.loaders = {}
        // 模型加载
        this.loaders.gltfLoader = new GLTFLoader()
        // 纹理加载
        this.loaders.textureLoader = new THREE.TextureLoader()
        // 立方体加载 
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }
    startLoading(){
        // load each source
        for (const source of this.sources) {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,(file)=>{
                        // console.log(source,file,'222222222')
                        this.sourceLoaded(source,file)
                    }
                )
            }else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,(file)=>{
                        this.sourceLoaded(source,file)
                    }
                )
            }else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,(file)=>{
                        this.sourceLoaded(source,file)
                    }
                )
            }
        }
    }
// 资源加载结束 
    sourceLoaded(source,file){
        // console.log(source,file)
        this.items[source.name] = file
        this.loaded++
        if (this.loaded === this.toLoad) {
            // console.log("11", 11)
            // 所有加载器加载完成
            this.trigger('loaded')
        }
    }
}