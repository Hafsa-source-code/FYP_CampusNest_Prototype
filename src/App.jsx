import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'

/** The app = the router. Which page shows is decided by the address bar. */
export default function App() {
  return <RouterProvider router={router} />
}