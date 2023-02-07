import { createSlice } from "@reduxjs/toolkit";

export const playAllSlice = createSlice({
    name: "playAll",
    initialState: {
        sectionToPlay: -1,  //this is actually an array index
        tryToStart: false,
        playAllStarted: false,
        alreadyPlaying: false, 
        finished: false,
        playAllCanvasCreated: false
    },
    reducers: {
        setSectionToPlay(state,action) {
            state.sectionToPlay = action.payload
        },
        setPlayAllStarted(state,action) {
            state.playAllStarted= action.payload
        },
        setTryToStart(state,action) {
            state.tryToStart = action.payload
        },
        setAlreadyPlaying(state,action) {
            state.alreadyPlaying = action.payload
        },
        setFinished(state,action) {
            state.finished = action.payload
        },
        setPlayAllCanvasCreated(state,action) {
            state.finished = action.playload
        }
    }
})

export const {setSectionToPlay,setTryToStart,
    setPlayAllStarted, alreadyPlaying, 
    setPlayAllCanvasCreated, setFinished } = playAllSlice.actions

export default playAllSlice.reducer

