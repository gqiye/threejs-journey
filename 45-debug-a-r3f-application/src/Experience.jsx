import { OrbitControls } from '@react-three/drei'
// folder 多重文件
import {folder,button, useControls } from 'leva'
import {Perf} from 'r3f-perf'

export default function Experience()
{
    const {PerfVisable} = useControls('perf',{
        PerfVisable:true
    })
    // 放置任何值
    const { position ,color,visible}= useControls('sphere',{
        position:
        {
            value:{
                x:-2,
                y:0,
            },
            step:0.01,
            joystick:'invertY'
        },
        color:'#ff0000',
        visible:true,
        myInterval:{
            min:0,max:10,value:[4,5]
        },
        clickMe: button(()=>{console.log(123)}),
        choice:{options:['a','b']},
    })
    
    const cubeOption = useControls('cube',{
        scale:{
            value:1.5,
            step:0.1,
            max:5,
            min:0
        }
    })

    return <>
      { PerfVisable && <Perf position='top-left'/>}
        <OrbitControls makeDefault />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

        <mesh position={ [position.x,position.y,0] } visible={visible}>
            <sphereGeometry />
            <meshStandardMaterial color={color} />
        </mesh>

        <mesh position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

    </>
}