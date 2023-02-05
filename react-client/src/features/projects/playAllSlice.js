import { createSlice } from "@reduxjs/toolkit";

export const playAllSlice = createSlice({
    name: "playAll",
    initialState: {
        sectionToPlay: -1,  //this is actually an array index
        tryToStart: false,
        playAllStarted: false,
        alreadyPlaying: false,
        next: -1, 
        finished: false,
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
        setNext(state,action) {
            state.next = action.payload
        },
        setFinished(state,action) {
            state.finished = action.payload
        }
    }
})

export const {setSectionToPlay,setTryToStart,
    setPlayAllStarted, alreadyPlaying, setNext, setFinished } = playAllSlice.actions

export default playAllSlice.reducer

