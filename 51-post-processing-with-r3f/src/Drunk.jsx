import DrunkEffect from "./DrunkEffect"
import {forwardRef} from 'react'
// ref 使用的函数组件使用forwardRef 格式如下,参数记得加ref
export default forwardRef(function Drunk(props,ref)
{
    const effect = new DrunkEffect(props)

    return <primitive ref={ref} object={effect}/>
})