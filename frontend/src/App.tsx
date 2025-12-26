import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ReportItem } from './pages/ReportItem'
import { MyReports } from './pages/MyReports'
import { AdminDashboard } from './pages/AdminDashboard'
import { NotFound } from './pages/NotFound'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { AdminRoute } from './routes/AdminRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/report/:type" element={<ReportItem />} />
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
