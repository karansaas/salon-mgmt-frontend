import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuth } from './features/auth/AuthProvider';

const LoginRoute = () => { const { user, isLoading } = useAuth(); return !isLoading && user ? <Navigate to="/" replace /> : <LoginPage />; };
export const App = () => <Routes><Route path="/login" element={<LoginRoute />} /><Route element={<ProtectedRoute />}><Route element={<DashboardLayout />}><Route index element={<DashboardPage />} /></Route></Route><Route path="*" element={<NotFoundPage />} /></Routes>;
