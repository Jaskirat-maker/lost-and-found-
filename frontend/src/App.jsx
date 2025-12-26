import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout.jsx'
import Home from './pages/Home.jsx'
import ReportLost from './pages/ReportLost.jsx'
import ReportFound from './pages/ReportFound.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MyReports from './pages/MyReports.jsx'
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import { AdminRoute } from './routes/AdminRoute.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/report/lost" element={<ReportLost />} />
          <Route path="/report/found" element={<ReportFound />} />
          <Route path="/my-reports" element={<MyReports />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

