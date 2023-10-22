import * as THREE from 'three'
import { useMemo,useRef,useEffect } from 'react';
// import { DoubleSide } from 'three';
export default function CustomObject(){
    //x,y,z
    const verticesCount = 10*3;
    const geometryRef = useRef();
    // 第一次渲染后
    useEffect(()=>{
        // 计算顶点法线
        // 解决物料被光照的效果问题
        geometryRef.current.computeVertexNormals()
    },[])
    // 它在每次重新渲染的时候能够缓存计算的结果。
    // 优化计算
    const position = useMemo(()=>{
        // 每个几何三个值(三角形)
    const position = new Float32Array(verticesCount*3)
    
    for (let i = 0; i < verticesCount*3; i++) {
        position[i] = (Math.random()-0.5)*3;
        
    }
    return position
    },[])
    // console.log(position)

    return <mesh>
        <bufferGeometry ref={geometryRef}>
            {/* 
                count 顶点个数
                itemSize 多少元素组成一个顶点
                array 数组
            */}
            <bufferAttribute
                attach="attributes-position"
                count={verticesCount}
                itemSize={3}
                array={position}
            />
        </bufferGeometry>
        <meshStandardMaterial color={'red'} side={THREE.DoubleSide}/>
    </mesh>
}