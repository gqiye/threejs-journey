import { useEffect, useState } from "react"
import { ClickerButton } from "./Clicker.jsx";

export default function App(){

    const [Clicker, setClicker] = useState(true);


    function toggleClick(){
        setClicker(!Clicker)
    }

    return <div>
        
        <button onClick={toggleClick}>{Clicker?'aa':'bb'}</button>

        {Clicker && <ClickerButton/>}
    </div>
}