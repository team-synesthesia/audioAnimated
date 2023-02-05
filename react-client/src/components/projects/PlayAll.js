import * as React from "react"
import {setSectionToPlay,setTryToStart,setFinished} from "../../features/projects/playAllSlice"
import { useDispatch, useSelector } from "react-redux";

export default function PlayAll() {
    const dispatch = useDispatch()

    const sections = useSelector(state=>state.singleProject.sections)
    const { playAllStarted, finished} = useSelector( state=>state.playAll)
    const started = React.useRef(false)

    React.useEffect(()=>{
        if ( !started.current) {
            console.log('starting')
            dispatch(setTryToStart(true))
            dispatch(setSectionToPlay(0))
            started.current = true
        }
    },[playAllStarted,dispatch])

    React.useEffect( ()=>{
        if (finished) {
            started.current = false;
            dispatch(setTryToStart(false))
            dispatch(setFinished(false))
            dispatch(setSectionToPlay(-1))
            console.log('finished')
        }
    },[finished, dispatch])
 
    return ( <div>Looks like there are: {sections.length} Sections to Play</div>)
}