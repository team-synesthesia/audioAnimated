import * as React from "react"
import * as THREE from "three"
import {createVertexModel,animateVertexModel,
        createShaderModel,animateShaderModel} from "./graphicsFunctions" 
import { graphicsOptions } from "./graphicsOptions"

//gpuDivRef was passed in as:  gpuDivRef.current in order to satisfy the dependencies array
export function GPU( {GPUconfig,gpuDivRef,canvasInitialized,setCanvasInitialized} ) {
    
    //console.log('in gpu',gpuDivRef)

    const [GL, setGL] = React.useState({})
 
    const frameIdRef = React.useRef()
    const isRendering = React.useRef(false)
    const isPlayingRef = React.useRef()

    const fps = 30
    const fpsInterval = 1000/fps

    const { isPlaying,acPlusRef,sectionNumber,graphicsFn } = GPUconfig

    const ACtoUse = React.useRef()

    if (GPUconfig.acRefs) {
        //console.log('acrefs',GPUconfig.acRefs)
        ACtoUse.current = GPUconfig.acRefs.current[sectionNumber]
    }
    else {
        ACtoUse.current = acPlusRef
    }
    //console.log(sectionNumber,acPlusRef)

    console.log('d1', sectionNumber )

    const [windowSize,setWindowSize] = React.useState()
    const resizeRef = React.useRef(false)
 
    React.useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
          // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
          resizeRef.current = true
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); 

    React.useEffect(()=>{

        console.log('d2', sectionNumber )

        let canvas, canvasDim, hidden
        if ( gpuDivRef) {
            canvas = gpuDivRef
            canvasDim = canvas.getBoundingClientRect()
            hidden = (canvas.classList.value.includes('hidden') )
        }

        if (gpuDivRef && !canvasInitialized 
            && !hidden && typeof graphicsFn !== "undefined") {

            setCanvasInitialized(true)

            const [width,height] = [canvasDim.width, canvasDim.height]
            //set canvas property so that we get WebGL2 ???

            const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true})
            renderer.setSize(width, height,  false);  //get dimensions of gpuDivRef
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
                console.log('xxx',ACtoUse.current)
            }

            function render(time) {
   
                //console.log('section',sectionNumber)

                if ( !isPlayingRef.current ) {
                    isRendering.current = false
                    cancelAnimationFrame(frameIdRef.current)
                    return
                } 

                if ( resizeRef.current) {
                    console.log('xxxxxxxxxxxxx',gpuDivRef.getBoundingClientRect())
                    resizeRef.current = false
                    const newDim = gpuDivRef.getBoundingClientRect()
                    const {width,height} = newDim
                    //camera.aspect = width/height
                    //camera.updateProjectionMatrix()
                    renderer.setSize(width,height)
                }

                frameIdRef.current = requestAnimationFrame(render);
                //we are rendering way too many times a second
                const currentRenderTime = Date.now()
                const elapsed = currentRenderTime - prevRenderTime

                if ( elapsed < fpsInterval ) return;

                prevRenderTime = currentRenderTime - (elapsed%fpsInterval)
                time *= .001  //convert from milliseconds to seconds

                const AC =  ACtoUse.current //acPlusRef 
  
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
        sectionNumber,graphicsFn,GPUconfig])
   
}
