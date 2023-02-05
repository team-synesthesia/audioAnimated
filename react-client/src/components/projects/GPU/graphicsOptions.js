import * as React from "react"

export const graphicsOptions = [
    {type:"shader", fn:3, name:"Luminescent Tiles", imgUrl:"g2.jpg"},
    {type:"shader", fn:2, name:"Gaz Inspired", imgUrl:"g1.jpg"},
    {type:"shader", fn:3, name:"Luminescent Tiles", imgUrl:"g2.jpg"},
    {type:"shader", fn:2, name:"Gaz Inspired", imgUrl:"g1.jpg"},
    {type:"vertex", fn:0, name:"Dancing Cube", imgUrl:"g0.jpg"}
]

export default function GraphicsOptions() {

    const [go,SetGO] = React.useState(0)  //go = graphics option which is index to graphicsOptions
    const dev=true
    const devServer="http://localhost:8080/"

    return (

        <div key="graphicsOptions" id="graphicsOptions">
            <h3>{go}</h3>
            {graphicsOptions.map( (option, index) =>
                <div key={"div"+option.name} 
                    onClick={ev=>{SetGO(index)}}
                >
                    <img key={option.name} 
                        style={{opacity: (index===go)?"1":null}} 
                        src={dev? (devServer+option.imgUrl): option.imgUrl} alt={option.name}>
                    </img>
                </div> 
            )}
        </div>
    )
}
