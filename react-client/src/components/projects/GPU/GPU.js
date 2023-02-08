import * as React from "react"
import * as THREE from "three"
import {createVertexModel,animateVertexModel,
        createShaderModel,animateShaderModel} from "./graphicsFunctions" 
import { graphicsOptions } from "./graphicsOptions"
import {useSelector} from "react-redux"

//gpuDivRef was passed in as:  gpuDivRef.current in order to satisfy the dependencies array
export function GPU( {GPUconfig,gpuDivRef,canvasInitialized,setCanvasInitialized} ) {
    
    //console.log('in gpu',gpuDivRef)

    const {graphicFN} = useSelector(state=>state.playAll)

    const [GL, setGL] = React.useState({})
 
    const frameIdRef = React.useRef()
    const isRendering = React.useRef(false)
    const isPlayingRef = React.useRef()

    const fps = 30
    const fpsInterval = 1000/fps

    const { isPlaying,acPlusRef,sectionNumber,graphicsFn } = GPUconfig
    const [gnum,setGnum] = React.useState(0)

    const ACtoUse = React.useRef()

    if (GPUconfig.acRefs) {
        //console.log('acrefs',GPUconfig.acRefs)
        ACtoUse.current = GPUconfig.acRefs.current[sectionNumber]
    }
    else {
        ACtoUse.current = acPlusRef
    }

    const resizeRef = React.useRef(false)
    const [restart, setRestart] = React.useState(false)

    const restartRef = React.useState(false)

    React.useEffect(()=>{
        if (gnum !== graphicFN) {
            isPlayingRef.current = false
            restartRef.current = true  //need a ref to interrupt the render loop
            setRestart(true)
        }
    },[graphicFN, gnum, GL.renderer, restartRef])

    React.useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
          resizeRef.current = true  //the gpuDivRef will have the new dimensions
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); 

    React.useEffect(()=>{

        console.log('graphics',gnum, graphicFN)
        let canvas, canvasDim, hidden
        if ( gpuDivRef) {
            canvas = gpuDivRef
            canvasDim = canvas.getBoundingClientRect()
            hidden = (canvas.classList.value.includes('hidden') )
        }

        const Restart = restart && gpuDivRef && !hidden

        console.log('zzzzzzzzzz Restart', restart, Restart)
        if ( (gpuDivRef && !canvasInitialized 
            && !hidden && typeof graphicFN !== "undefined")
            || Restart
            ) {

            setCanvasInitialized(true)
      
            const [width,height] = [canvasDim.width, canvasDim.height]
            //set canvas property so that we get WebGL2 ???

            if (restart && GL.renderer) GL.renderer.dispose()

            console.log('zzzzzzzzzzzzzz creating renderer')
            const renderer = GL.renderer ?? new THREE.WebGLRenderer({antialias:true, alpha:true})
            renderer.setSize(width, height,  false);  //get dimensions of gpuDivRef
            renderer.setClearColor("rgb(255,255,255)", 0);

            if ( !GL.renderer ) canvas.appendChild(renderer.domElement);

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
            setGnum(graphicFN)
            try {
                useShader = graphicsOptions[graphicFN].type === "shader"
                gfn = graphicsOptions[graphicFN].fn
                console.log('gfn',gfn,graphicFN)
            }
            catch {
                console.log('graphics Function num out of bounds', graphicFN)
            }
        
            if (useShader) {
                const {camera,material} = createShaderModel(scene,uniforms,gfn)
                setGL({renderer,scene,camera,width,height,useShader,material,uniforms})
                renderer.render(scene,camera)
            }
            else {
                const {camera,light2,cube} = createVertexModel(scene,aspect)
                setGL({renderer,scene,camera,width,height,useShader,cube,light2,uniforms}) 
                renderer.render(scene,camera)

            }

            setRestart(false)

        }
        
        else if ( canvasInitialized ) {

            const {renderer,scene,camera,useShader,uniforms} = GL

            isPlayingRef.current = isPlaying
            let prevRenderTime = Date.now()

            if ( isPlaying && !isRendering.current ) {
                requestAnimationFrame(render)
                isRendering.current = true
            }

            function render(time) {
   
                //console.log('section',sectionNumber)

                if ( !isPlayingRef.current || restartRef.current ) {
                    isRendering.current = false
                    cancelAnimationFrame(frameIdRef.current)
                    return
                } 

                if ( resizeRef.current) {
                    resizeRef.current = false
                    const newDim = gpuDivRef.getBoundingClientRect()
                    const {width,height} = newDim
                    camera.aspect = width/height
                    camera.updateProjectionMatrix()
                    uniforms.iResolution.value = new THREE.Vector3(width, height, 1.0)
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
        sectionNumber,graphicsFn,GPUconfig,graphicFN,gnum,restart])
   
}
