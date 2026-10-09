import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { router } from './routes/router'

/**
 * The app = who is logged in (AuthProvider) + which page to show (router).
 * AuthProvider is on the outside so every page can ask "who is logged in?".
 */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
