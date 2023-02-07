import * as React from "react"
import {setSectionToPlay,setTryToStart,setPlayAllStarted} from "../../features/projects/playAllSlice"
import { useDispatch, useSelector } from "react-redux";

export default function PlayAll({closeModal}) {

    const dispatch = useDispatch()

    const sections = useSelector(state=>state.singleProject.sections)
    const { playAllStarted, finished} = useSelector( state=>state.playAll)
    const started = React.useRef(false)

    const counter = React.useRef(0)

    React.useEffect(()=>{

        counter.current ++
        console.log("counter",playAllStarted)
       // closeModal()
   
        if ( !started.current ) {
            dispatch(setTryToStart(true))
            dispatch(setSectionToPlay(0))
            started.current = true
        }
    },[playAllStarted,started,dispatch,closeModal])

    React.useEffect( ()=>{
        if (finished) {
            started.current = false;
            dispatch(setTryToStart(false))
            dispatch(setSectionToPlay(-1))
            dispatch(setPlayAllStarted(false))
        }
    },[finished, dispatch])
 
    return ( 
        <div>
            Looks like there are: {sections.length} Sections to Play
        </div>)
}