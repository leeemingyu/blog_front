import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../common/DefaultLayout'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { CreatePost } from '../pages/CreatePost'
import { PostListPage } from '../pages/PostListPage'
import { PostDetailPage } from '../pages/PostDetailPage'
import { EditePost } from '../pages/EditePost'
import { UserPage } from '../pages/UserPage'
import { UserInfoUpdate } from '../pages/UserInfoUpdate'
import { postListLoader } from '../loaders/postListLoader'
import { postDetailLoader } from '../loaders/postDetailLoader'
import ErrorPage from '../pages/ErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <PostListPage />,
        loader: postListLoader,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/createPost',
        element: <CreatePost />,
      },
      {
        path: '/detail/:postId',
        element: <PostDetailPage />,
        loader: postDetailLoader,
      },
      {
        path: '/edit/:postId',
        element: <EditePost />,
      },
      {
        path: '/userpage/:username',
        element: <UserPage />,
      },
      {
        path: '/update-profile',
        element: <UserInfoUpdate />,
      },
    ],
  },
])
