import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {logOut, setCredentials} from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://posts-api-qvua.onrender.com",
    // baseUrl: "http://localhost:8080",
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.token

        if(token) {
            headers.set("authorization", `Bearer ${token}`)
        }

        return headers
    }
})

const baseQueryWithRefresh = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.originalStatus === 403) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if(refreshResult?.data) {
            api.dispatch(setCredentials(refreshResult.data))

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
            return refreshResult
        }
    }

    return  result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Post'],
    endpoints: () => ({})
})