// src/components/Sidebar.tsx

import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {
    Calendar,
    HelpCircle,
    Image,
    LayoutDashboard,
    ListMusic,
    Menu,
    Monitor,
    PlaySquare,
    Settings,
} from 'lucide-react';
import {useTheme} from '../contexts/ThemeContext';
import {Logo} from './ui/Logo';
import {Button} from './ui/Button';

interface SidebarProps {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarCollapsed, setSidebarCollapsed }) => {
    const location = useLocation();
    const {currentTheme} = useTheme();

    const navItems = [
        {path: '/', icon: <LayoutDashboard className="w-5 h-5"/>, label: 'Dashboard'},
        {path: '/content', icon: <Image className="w-5 h-5"/>, label: 'Content Library'},
        {path: '/campaigns', icon: <PlaySquare className="w-5 h-5"/>, label: 'Campaigns'},
        {path: '/screens', icon: <Monitor className="w-5 h-5"/>, label: 'Screens'},
        {path: '/schedules', icon: <Calendar className="w-5 h-5"/>, label: 'Schedules'},
        {path: '/playlists', icon: <ListMusic className="w-5 h-5"/>, label: 'Playlists'},
        {path: '/settings', icon: <Settings className="w-5 h-5"/>, label: 'Settings'},
        {path: '/help', icon: <HelpCircle className="w-5 h-5"/>, label: 'Help Center'},
    ];

    return (
        <aside
            className={`border-r transition-all duration-300 flex-shrink-0 ${
                sidebarCollapsed ? 'w-20' : 'w-64'
            }`}
            style={{
                backgroundColor: currentTheme.colors.background.primary,
                borderColor: currentTheme.colors.border.primary,
            }}
        >
            <div className="p-4 h-20 flex items-center justify-between border-b"
                 style={{borderColor: currentTheme.colors.border.primary}}>
                <Link to="/" className="flex items-center gap-2" style={{color: currentTheme.colors.brand.primary}}>
                    <Logo className="w-8 h-8"/>
                    {!sidebarCollapsed && (
                        <span className="text-xl font-bold" style={{color: currentTheme.colors.text.primary}}>
                Hapo CMS
              </span>
                    )}
                </Link>
                {!sidebarCollapsed && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        <Menu className="w-5 h-5"/>
                    </Button>
                )}
            </div>

            <nav className="mt-4 px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center w-full mb-1 rounded-lg transition-colors ${
                            sidebarCollapsed ? 'justify-center h-12' : 'px-4 py-3'
            }`}
                        style={{
                            backgroundColor: location.pathname === item.path
                                ? currentTheme.colors.interactive.secondary
                                : 'transparent',
                            color: location.pathname === item.path
                                ? currentTheme.colors.brand.primary
                                : currentTheme.colors.text.secondary,
                        }}
                        onMouseEnter={(e) => {
                            if (location.pathname !== item.path) {
                                e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (location.pathname !== item.path) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                        title={item.label}
                    >
                        {item.icon}
                        {!sidebarCollapsed && (
                            <span className="ml-3 font-medium">{item.label}</span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* This button only appears when the sidebar is collapsed */}
            {sidebarCollapsed && (
                <div className="mt-auto p-2">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full"
                    >
                        <Menu className="w-5 h-5"/>
                    </Button>
                </div>
            )}
        </aside>
    );
};