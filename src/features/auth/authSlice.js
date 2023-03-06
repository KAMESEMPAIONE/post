import {createSlice} from "@reduxjs/toolkit"
import jwtDecode from "jwt-decode"

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        id: null,
        user: null,
        roles: null,
        token: null
    },
    reducers: {
        setCredentials: {
            reducer (state, action) {
                state.id = action.payload.id
                state.user = action.payload.user
                state.roles = action.payload.roles
                state.token = action.payload.token
            },

            prepare (token) {
                const {accessToken} = token
                const decoded = jwtDecode(accessToken)
                return {
                    payload: {
                        user: decoded.username,
                        id: decoded.id,
                        roles: decoded.roles,
                        token: accessToken
                    }
                }
            }
        },

        logOut: (state, action) => {
            state.id = null
            state.user = null
            state.roles = null
            state.token = null
        }
    }
})

export default authSlice.reducer
export const { setCredentials, logOut } = authSlice.actions

export const selectCurrentId = (state) => state.auth.id
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentRoles = (state) => state.auth.roles
export const selectCurrentToken = (state) => state.auth.token