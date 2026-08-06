import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

const navItems = ['Dashboard', 'Clients', 'Services', 'Products', 'Employees', 'Billing', 'Reports', 'Notifications', 'Settings'];
export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageTitle = location.pathname.startsWith('/clients') ? 'Clients' : location.pathname.startsWith('/services') ? 'Services' : location.pathname.startsWith('/products') ? 'Products' : location.pathname.startsWith('/employees') ? 'Employees' : 'Dashboard';
  return <div className="min-h-screen bg-slate-50 lg:flex">
    <aside className="bg-slate-950 p-5 text-white lg:fixed lg:inset-y-0 lg:w-64"><div className="mb-8 text-xl font-bold">Salon<span className="text-blue-400">Flow</span></div><nav className="flex gap-1 overflow-x-auto lg:flex-col">{navItems.map((item) => <NavLink key={item} to={item === 'Dashboard' ? '/' : item === 'Clients' ? '/clients' : item === 'Services' ? '/services' : item === 'Products' ? '/products' : item === 'Employees' ? '/employees' : '#'} className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${isActive && ['Dashboard', 'Clients', 'Services', 'Products', 'Employees'].includes(item) ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>{item}</NavLink>)}</nav></aside>
    <main className="min-w-0 flex-1 lg:ml-64"><header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8"><div><h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1><p className="text-sm text-slate-500">{pageTitle === 'Clients' ? 'Manage your salon clients' : pageTitle === 'Services' ? 'Manage services offered by your salon' : pageTitle === 'Products' ? 'Manage products and inventory' : pageTitle === 'Employees' ? 'Manage your salon team' : 'Your salon at a glance'}</p></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-medium text-slate-800">{user?.name}</p><p className="text-xs text-slate-500">{user?.role}</p></div><button onClick={() => void logout()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Logout</button></div></header><div className="p-5 sm:p-8"><Outlet /></div></main>
  </div>;
};
