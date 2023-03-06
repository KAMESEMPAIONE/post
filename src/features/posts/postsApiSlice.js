import { apiSlice } from "../../app/api/apiSlice"
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit"

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => {
       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
})

const initialState = postsAdapter.getInitialState()

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllPosts: builder.query({
           query: () => ({
               url: '/posts',
               validateStatus: (response, result) => {
                   return response.status === 200 && !result.isError
               },
           }),

           transformResponse: response => {
               const loadedPosts = response.map(post => {
                   post.id = post.postId
                   return post
               })
                return postsAdapter.setAll(initialState, loadedPosts)
           },

           providesTags: (result, error, arg) => {
                if(result?.ids) {
                    return [
                        {type: "Post", id: "LIST"},
                        ...result.ids.map(id => ({type: "Post", id}))
                    ]
                } else {
                    return [{type: "Post", id: "LIST"}]
                }
           }
        }),

        createPost: builder.mutation({
            query: data => ({
                url: "/posts",
                method: "POST",
                body: {...data}
            }),

            invalidatesTags: [{type: "Post", id: "LIST"}]
        }),

        updatePost: builder.mutation({
            query: data => ({
                url: `/posts/${data.id}`,
                method: "PATCH",
                body: {...data}
            }),

            invalidatesTags: (result, err, arg) => [
                {type: "Post", id: arg.id}
            ]
        }),

        deletePost: builder.mutation({
            query: ({postId}) => ({
                url: `/posts/${postId}`,
                method: "DELETE",
            }),

            invalidatesTags: (result, err, arg) => [
                {type: "Post", id: arg.id}
            ]
        }),

        addComment: builder.mutation({
            query: data => ({
                url: `/posts/${data.id}/comments`,
                method: "POST",
                body: {...data}
            }),

            invalidatesTags: (result, err, arg) => [
                {type: "Post", id: arg.id}
            ]
        }),

        updateComment: builder.mutation({
            query: data => ({
                url: `/posts/${data.id}/comments`,
                method: "PATCH",
                body: {...data}
            }),

            invalidatesTags: (result, err, arg) => [
                {type: "Post", id: arg.id}
            ]
        }),

        deleteComment: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.id}/comments`,
                method: "DELETE",
                body: {...data}
            }),

            invalidatesTags: (result, err, arg) => [
                {type: "Post", id: arg.id}
            ]
        })
    })
})

export const {
    useGetAllPostsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = postsApiSlice

const selectPostsResult = postsApiSlice.endpoints.getAllPosts.select()

const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data
)

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)

