import { Navigate, Route, Routes } from 'react-router-dom';
import { ActionCenterPage } from './pages/ActionCenterPage';
import { AddClientPage, EditClientPage } from './pages/ClientFormPages';
import { AddEmployeePage, EditEmployeePage } from './pages/EmployeeFormPages';
import { AddProductPage, EditProductPage } from './pages/ProductFormPages';
import { AddServicePage, EditServicePage } from './pages/ServiceFormPages';
import { BillDetailsPage } from './pages/BillDetailsPage';
import { BillsPage } from './pages/BillsPage';
import { ClientDetailsPage } from './pages/ClientDetailsPage';
import { ClientsPage } from './pages/ClientsPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeeDetailsPage } from './pages/EmployeeDetailsPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { InsightsPage } from './pages/InsightsPage';
import { LoginPage } from './pages/LoginPage';
import { LoyaltySettingsPage } from './pages/LoyaltySettingsPage';
import { LowStockPage } from './pages/LowStockPage';
import { NewBillPage } from './pages/NewBillPage';
import { MyAttendancePage } from './pages/MyAttendancePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProductsPage } from './pages/ProductsPage';
import { PublicWebsitePage } from './pages/PublicWebsitePage';
import { ReportsPage } from './pages/ReportsPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { ServicesPage } from './pages/ServicesPage';
import { DashboardLayout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import { useAuth } from './features/auth/AuthProvider';

const LoginRoute = () => {
  const { user, isLoading } = useAuth();
  return !isLoading && user ? <Navigate to={user.role === 'Employee' ? '/billing' : '/admin'} replace /> : <LoginPage />;
};

export const App = () => <Routes>
  <Route path="/" element={<PublicWebsitePage />} />
  <Route path="/login" element={<LoginRoute />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      <Route element={<RoleRoute allowedRoles={['Admin', 'Staff']} />}>
        <Route path="admin" element={<DashboardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="action-center" element={<ActionCenterPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/new" element={<AddEmployeePage />} />
        <Route path="employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="employees/:id/edit" element={<EditEmployeePage />} />
        <Route path="services/new" element={<AddServicePage />} />
        <Route path="services/:id" element={<ServiceDetailsPage />} />
        <Route path="services/:id/edit" element={<EditServicePage />} />
        <Route path="products/low-stock" element={<LowStockPage />} />
        <Route path="products/new" element={<AddProductPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="professional-products/low-stock" element={<LowStockPage productType="PROFESSIONAL" basePath="/professional-products" title="Professional Products Low Stock" />} />
        <Route path="professional-products/new" element={<AddProductPage productType="PROFESSIONAL" basePath="/professional-products" />} />
        <Route path="professional-products/:id" element={<ProductDetailsPage productType="PROFESSIONAL" basePath="/professional-products" />} />
        <Route path="professional-products/:id/edit" element={<EditProductPage productType="PROFESSIONAL" basePath="/professional-products" />} />
        <Route path="clients/:id/edit" element={<EditClientPage />} />
      </Route>
      <Route element={<RoleRoute allowedRoles={['Admin']} />}>
        <Route path="settings/loyalty" element={<LoyaltySettingsPage />} />
      </Route>
      <Route element={<RoleRoute allowedRoles={['Employee']} />}>
        <Route path="my-attendance" element={<MyAttendancePage />} />
      </Route>
      <Route path="clients" element={<ClientsPage />} />
      <Route path="clients/new" element={<AddClientPage />} />
      <Route path="clients/:id" element={<ClientDetailsPage />} />
      <Route path="services" element={<ServicesPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="professional-products" element={<ProductsPage productType="PROFESSIONAL" title="Professional Products" description="Manage internal-use salon products and inventory." basePath="/professional-products" />} />
      <Route path="billing" element={<BillsPage />} />
      <Route path="billing/new" element={<NewBillPage />} />
      <Route path="billing/:id" element={<BillDetailsPage />} />
    </Route>
  </Route>
  <Route path="*" element={<NotFoundPage />} />
</Routes>;
