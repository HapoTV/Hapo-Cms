import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { NotificationCenter } from '../components/NotificationCenter';
import { Footer } from '../components/Footer';
import UserProfile from '../components/UserProfile';

export const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="flex justify-end items-center gap-4">
            <NotificationCenter />
            <UserProfile />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};