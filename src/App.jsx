import { Routes, Route } from 'react-router-dom'
import { PersistLogin } from "./features/auth/PersistLogin"
import { RequireAuth } from "./features/auth/RequireAuth"
import { Prefetch } from "./features/auth/Prefetch"
import { Home } from "./pages/Home/Home"
import { Register } from "./features/register/Register"
import { Login } from "./features/auth/Login"
import { NotFound } from "./pages/NotFound/NotFound"
import { PostsList } from "./features/posts/PostsList/PostsList"
import { MemoizedPost } from "./features/posts/Post/Post"
import { Layout } from "./components/Layout/Layout"
import { UpdateCredentials } from "./components/UpdateCredentials/UpdateCredentials"
import { CreatePost } from "./features/posts/CreatePost/CreatePost"
import { EditPost } from "./features/posts/EditPost/EditPost"
import { AccessDenied } from "./pages/AccessDenied/AccessDenied"

const App =  () => {
  return (
      <Routes>
          <Route path="/register" element={ <Register/> }/>
          <Route path="/login" element={ <Login/> }/>

          <Route element={ <PersistLogin/> }>
              <Route path="/" element={ <Home/> }/>

              <Route element={ <Layout/> }>

                  <Route element={ <RequireAuth allowedRoles={['User', 'Editor','Admin'] }/>}>
                      <Route element={ <Prefetch/> }>
                          <Route path="/posts" element={ <PostsList/> }/>
                          <Route path="/posts/:postId" element={ <MemoizedPost/> }/>

                          <Route path="/update-credentials" element={ <UpdateCredentials field="Username"/> }/>
                          <Route path="/update-credentials/password" element={ <UpdateCredentials field="Password"/> }/>

                          <Route element={<RequireAuth allowedRoles={['Editor']}/>}>

                              <Route path="/posts/my-posts" element={ <PostsList postByAuthor={true}/> }/>
                              <Route path="/posts/create" element={ <CreatePost/> }/>
                              <Route path="/posts/:postId/edit" element={ <EditPost/> }/>

                          </Route>
                      </Route>
                  </Route>


              </Route>
          </Route>

          <Route path="/access-denied" element={ <AccessDenied/> }/>
          <Route path="*" element={ <NotFound/> }/>
      </Routes>
  )
}

export default App
