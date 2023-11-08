import { useKeyboardControls } from "@react-three/drei"
import useGame from "./stores/useGame"
import { useEffect, useRef } from "react"
import { addEffect } from "@react-three/fiber"

export default function Interface(params) {

    const time = useRef()
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    useEffect(() => {
        // 会不断调用
        const unsubscribeEffect = addEffect(() => {
            // s实时获取状态
            const state = useGame.getState()
            let elapsedTime = 0
            if (state.phase === 'playing') {
                elapsedTime = Date.now() - state.startTime
            } else if (state.phase === 'ended') {
                elapsedTime = state.endTime - state.startTime
            }
            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)
            console.log(elapsedTime)
            if (time.current) {
                time.current.textContent = elapsedTime
            }
        })

        return () => {
            unsubscribeEffect()
        }
    }, [])

    return <div className="interface">
        <div ref={time} className="time"> 0.00</div>
        {
            phase === "ended" && <div className="restart" onClick={restart} > restart</div>
        }
        {/* 控制 */}
        <div className="controls">
            <div className="raw">
                <div className={`key ${forward ? 'active' : ''}`}>w</div>
            </div>
            <div className="raw">
                <div className={`key ${leftward ? 'active' : ''}`}>a</div>
                <div className={`key ${backward ? 'active' : ''}`}>s</div>
                <div className={`key ${rightward ? 'active' : ''}`}>d</div>
            </div>
            <div className="raw">
                <div className={`key large ${jump ? 'active' : ''}`}>空格</div>
            </div>
        </div>

    </div>
}