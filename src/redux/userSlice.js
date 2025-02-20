import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        setUser: (state, data)=>{
            state.user = data.payload
            if (!data.payload.owned_domains){
                state.user.owned_domains = []
            }
        },
        login: (state, data)=>{
            localStorage.setItem('accessToken', data.payload.access_token)
            localStorage.setItem('refreshToken', data.payload.refresh_token)
            window.location.reload()
        },
        logout: (state) => {
            state.user = {}
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('currentSite')
            window.location.reload()
        },
    },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;