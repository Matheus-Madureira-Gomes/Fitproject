import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Dumbbell, Utensils, LayoutDashboard, Users, LineChart, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { UserRole } from './types';

// Pages (defined within App.tsx for simplicity in this structure, ideally separate files)
import Dashboard from './pages/Dashboard';
import WorkoutPage from './pages/WorkoutPage';
import DietPage from './pages/DietPage';
import ProgressPage from './pages/ProgressPage';
import SocialPage from './pages/SocialPage';
import TrainerDashboard from './pages/TrainerDashboard';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleRole = () => {
    setRole(prev => prev === UserRole.USER ? UserRole.TRAINER : UserRole.USER);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
        {/* Navigation Sidebar / Mobile Header */}
        <Navigation 
          role={role} 
          toggleRole={toggleRole} 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative">
          <Routes>
            <Route path="/" element={<Dashboard role={role} />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/trainer" element={<TrainerDashboard />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

const Navigation = ({ role, toggleRole, isMobileMenuOpen, setIsMobileMenuOpen }: any) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/workout', icon: Dumbbell, label: 'Workouts' },
    { path: '/diet', icon: Utensils, label: 'Diet & Macros' },
    { path: '/social', icon: Users, label: 'Community' },
    { path: '/progress', icon: LineChart, label: 'Evolution' },
  ];

  if (role === UserRole.TRAINER) {
     navItems.push({ path: '/trainer', icon: MessageSquare, label: 'Trainer Area' });
  }

  const NavLinkItem = ({ item, onClick }: any) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-emerald-600/20 text-emerald-400 font-medium' 
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
        }`
      }
    >
      <item.icon size={20} />
      <span>{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center">
            <span className="font-bold text-zinc-950">IP</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">IronPulse</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLinkItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="pt-6 border-t border-zinc-800">
          <button 
            onClick={toggleRole}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 text-sm transition-colors"
          >
            <LogOut size={18} />
            <span>Switch to {role === UserRole.USER ? 'Trainer' : 'User'}</span>
          </button>
          <div className="mt-4 px-4 flex items-center gap-3">
             <img src="https://picsum.photos/seed/user1/40/40" alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-emerald-500/50" />
             <div className="flex flex-col">
               <span className="text-sm font-medium text-white">{role === UserRole.USER ? 'John Doe' : 'Coach Mike'}</span>
               <span className="text-xs text-zinc-500">{role}</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center">
            <span className="font-bold text-zinc-950">IP</span>
          </div>
          <span className="font-bold">IronPulse</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-300">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-zinc-950 z-40 pt-20 px-4 md:hidden animate-fade-in">
           <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLinkItem key={item.path} item={item} onClick={() => setIsMobileMenuOpen(false)} />
            ))}
          </nav>
           <div className="mt-8 pt-6 border-t border-zinc-800">
             <button 
                onClick={() => { toggleRole(); setIsMobileMenuOpen(false); }}
                className="w-full py-3 bg-zinc-900 rounded-lg text-zinc-300"
              >
                Switch to {role === UserRole.USER ? 'Trainer' : 'User'}
              </button>
           </div>
        </div>
      )}
    </>
  );
};

export default App;
