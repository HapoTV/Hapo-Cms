import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  PlaySquare,
  Monitor,
  Calendar,
  Settings,
  HelpCircle,
  Menu,
  Cloud,
  ListMusic
} from 'lucide-react';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}
export const Sidebar: React.FC<SidebarProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/content', icon: <Image className="w-5 h-5" />, label: 'Content Library' },
    { path: '/campaigns', icon: <PlaySquare className="w-5 h-5" />, label: 'Campaigns' },
    { path: '/screens', icon: <Monitor className="w-5 h-5" />, label: 'Screens' },
    { path: '/schedules', icon: <Calendar className="w-5 h-5" />, label: 'Schedules' },
    { path: '/playlists', icon: <ListMusic className="w-5 h-5" />, label: 'Playlists' },
    { path: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { path: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help Center' },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      sidebarCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-blue-500" />
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-gray-900">Hapo CMS</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <nav className="mt-6 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {!sidebarCollapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};