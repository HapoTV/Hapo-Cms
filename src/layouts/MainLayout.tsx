import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {Sidebar} from '../components/Sidebar';
import {NotificationCenter} from '../components/NotificationCenter';
import {Footer} from '../components/Footer';
import UserProfile from '../components/UserProfile';
import {ThemeSelector} from '../components/ThemeSelector';
import {useTheme} from '../contexts/ThemeContext';

export const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const {currentTheme} = useTheme();

  return (
      <div
          className="flex min-h-screen transition-colors duration-300"
          style={{backgroundColor: currentTheme.colors.background.secondary}}
      >
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col">
          <header
              className="border-b py-4 px-6 transition-colors duration-300"
              style={{
                  backgroundColor: currentTheme.colors.background.primary,
                  borderColor: currentTheme.colors.border.primary
              }}
          >
          <div className="flex justify-end items-center gap-4">
              <ThemeSelector/>
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