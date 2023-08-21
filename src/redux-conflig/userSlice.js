import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name:"user",
    initialState:{
        user:null,
        token:null
    },reducers:{
        savePost: (state,action)=>{
            state.user.savePosts.push(action.payload)
        },
        removePost:(state,action)=>{
            state.user.savePosts.splice(action.payload,1);
        },
        setToken:(state,action)=>{
            state.token = action.payload;
        },
        setUser:(state,action)=>{
            state.user = action.payload;
        }
    }
});
export const{setToken,setUser,savePost,removePost} = slice.actions
export default slice.reducer;