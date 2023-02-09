import * as React from "react"
import {setGraphicFN} from "../../../features/projects/playAllSlice"
import {useDispatch,useSelector} from "react-redux"

export const graphicsOptions = [
    {type:"shader", fn:3, name:"Luminescent Tiles", imgUrl:"g2.jpg"},
    {type:"shader", fn:2, name:"Gaz Inspired", imgUrl:"g1.jpg"},
    {type:"shader", fn:1, name:"Ode To Julia", imgUrl:"g3.jpg"},
    {type:"shader", fn:4, name:"D20 Bubbles", imgUrl:"g4.jpg"},
    {type:"shader", fn:5, name:"Mandel Exp", imgUrl:"g5.jpg" },
    {type:"vertex", fn:0, name:"Dodeca-God Rays", imgUrl:"g0.jpg"}
]

export default function GraphicsOptions() {

    const dispatch = useDispatch()

    //defaults to 0
    const {graphicFN} = useSelector(state=>state.playAll) 
    
    //need to define dev based on .env for when we got to render.com
    const dev=true
    const devServer="http://localhost:8080/"

    function SetGO (index) {
        dispatch(setGraphicFN(index))
    }

    return (
         
        <div key="graphicsOptions" id="graphicsOptions">
            {graphicsOptions.map( (option, index) =>
                <div key={"div"+option.name} 
                    onClick={ev=>{SetGO(index)}}
                >
                    <img key={option.name} 
                        style={{opacity: (index===graphicFN)?"1":null}} 
                        src={dev? (devServer+option.imgUrl): option.imgUrl} alt={option.name}>
                    </img>
                </div> 
            )}
            <div id="graphicChosen">{graphicsOptions[graphicFN].name} chosen</div>
        </div>
    )
}
