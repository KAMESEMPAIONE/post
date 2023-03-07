import { apiSlice } from "../../app/api/apiSlice"
import { setCredentials, logOut } from "./authSlice"


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        sendLogout: builder.mutation({
            query: (arg) => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            onQueryStarted(arg, {dispatch}) {
                try {
                    dispatch(logOut())
                } catch (err) {
                    console.error(err)
                }
            }
        }),

        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),

            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const { data } = await queryFulfilled

                    dispatch(setCredentials(data))
                } catch (err) {
                    console.error(err)
                }
            }
        }),

        update: builder.mutation({
            query: (credentials) => ({
                url: '/auth/update',
                method: 'PATCH',
                body: {...credentials}
            })
        })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useUpdateMutation
} = authApiSlice