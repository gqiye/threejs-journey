import { useEffect, useState } from "react"
export function ClickerButton(){
    const [count, setCount] = useState(parseInt(localStorage.getItem('count')??0));
    useEffect(()=>
    {
        console.log(456)
         // 每次渲染后都会执行此处的代码
        localStorage.setItem('count',count)
        // 只有销毁才会返回return
        return ()=>{
            console.log('组件销毁')
            localStorage.removeItem('count')
        }
    },[]
    )
    useEffect(()=>
    {
        console.log(123)
         // 每次渲染后都会执行此处的代码
        localStorage.setItem('count',count)
    }
    )
    function clickEvent(){
        setCount(count + 1);

    }


    return <button onClick={clickEvent}>{count}</button>
}