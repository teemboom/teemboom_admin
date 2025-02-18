import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";



const siteSlice = createSlice({
    name: 'site',
    initialState: {},
    reducers: {
        setSite: (state, data)=>{
            localStorage.setItem('currentSite', data.payload._id)
            state.site = data.payload
        }
    },
});

export const { setSite } = siteSlice.actions;
export default siteSlice.reducer;