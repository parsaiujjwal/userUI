import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Webapi/api";
import axios from "axios";

export const fetchPost = createAsyncThunk("fetchPost", async (page) => {
    let response = await axios.get("http://localhost:3000/post/getAllPost" + `?page=${page}`);
    return response.data
})
const slice = createSlice({
    name: "post",
    initialState: {
        postList: [],
        isLoading: false,
        error: null,
        totalpost:null
    },
    reducers: {
        setPosts: (state, action) => {
            state.postList = action.payload;         
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPost.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(fetchPost.fulfilled, (state, action) => {
            state.postList = action.payload.result;
            state.totalpost=action.payload.totalpost;
            state.isLoading = false;
        }).addCase(fetchPost.rejected, (state, action) => {
            state.isLoading = false;
            state.error = "Oops! something went wrong";
        })
    }
})
export const { setPosts } = slice.actions;
export default slice.reducer;