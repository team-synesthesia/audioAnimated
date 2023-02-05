import * as React from "react"
import * as THREE from "three"
import {createVertexModel,animateVertexModel,
        createShaderModel,animateShaderModel} from "./graphicsFunctions" 
import { graphicsOptions } from "./graphicsOptions"

//gpuDivRef was passed in as:  gpuDivRef.current in order to satisfy the dependencies array
export function GPU( {GPUconfig,gpuDivRef,canvasInitialized,setCanvasInitialized,sectionNumberx} ) {
    
    const { isPlaying,acPlusRef,sectionNumber,graphicsFn } = GPUconfig

    const [GL, setGL] = React.useState({})

    const frameIdRef = React.useRef()
    const isRendering = React.useRef(false)
    const isPlayingRef = React.useRef()

    const fps = 30
    const fpsInterval = 1000/fps


    React.useEffect(()=>{

        let canvas, canvasDim, hidden
        if ( gpuDivRef) {
            canvas = gpuDivRef
            canvasDim = canvas.getBoundingClientRect()
            hidden = (canvas.classList.value.includes('hidden') )
        }

        if (gpuDivRef && !canvasInitialized && !hidden) {

            console.log('zzzzzzzzz graphicsFn',graphicsFn, sectionNumberx)
            setCanvasInitialized(true)

            const [width,height] = [canvasDim.width, canvasDim.height]
            //set canvas property so that we get WebGL2 ???

            const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true})
            renderer.setSize(width, height);  //get dimensions of gpuDivRef
            renderer.setClearColor("rgb(255,255,255)", 0);
            canvas.appendChild(renderer.domElement);
            const aspect = width/height;

            const uniforms = {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector3(width, height, 1.0) },
                iMusic: { value: new THREE.Vector4(0, 0, 0, 0) },
                //iChannel0:    { value: texture }, //not currently used
              };

            uniforms.iResolution.value = new THREE.Vector3(width, height, 1.0)
            const scene = new THREE.Scene();

            let useShader = false
            let gfn=0
            try {
                useShader = graphicsOptions[graphicsFn].type === "shader"
                gfn = graphicsOptions[graphicsFn].fn
            }
            catch {
                console.log('graphics Function num out of bounds', graphicsFn)
            }
        
            if (useShader) {
                const {camera,material} = createShaderModel(scene,uniforms,gfn)
                setGL({renderer,scene,camera,width,height,useShader,material})
                renderer.render(scene,camera)
            }
            else {
                const {camera,light2,cube} = createVertexModel(scene,aspect)
                setGL({renderer,scene,camera,width,height,useShader,cube,light2}) 
                renderer.render(scene,camera)
            }

        }
        
        else if ( canvasInitialized ) {

            const {renderer,scene,camera,useShader} = GL

            isPlayingRef.current = isPlaying
            let prevRenderTime = Date.now()

            if ( isPlaying && !isRendering.current ) {
                requestAnimationFrame(render)
                isRendering.current = true
            }

            function render(time) {
   
                if ( !isPlayingRef.current ) {
                    isRendering.current = false
                    cancelAnimationFrame(frameIdRef.current)
                    return
                } 

                frameIdRef.current = requestAnimationFrame(render);
                //we are rendering way too many times a second
                const currentRenderTime = Date.now()
                const elapsed = currentRenderTime - prevRenderTime

                if ( elapsed < fpsInterval ) return;

                prevRenderTime = currentRenderTime - (elapsed%fpsInterval)
                time *= .001  //convert from milliseconds to seconds

                const AC =  acPlusRef     
                const md = AC.musicData()

                if ( useShader ) {
                    animateShaderModel(GL,md, time)
                }
                else {
                    animateVertexModel(GL,md)
                }

                renderer.render(scene,camera)

            }
        }

    },[gpuDivRef,canvasInitialized,GL,fpsInterval,
        setCanvasInitialized,isPlaying,acPlusRef,
        sectionNumber,graphicsFn,sectionNumberx])
   
}
