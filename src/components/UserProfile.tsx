// src/components/UserProfile.tsx

import {useEffect, useRef, useState} from 'react';
import {LogOut, Settings, User} from 'lucide-react';
import {useAuthStore} from '../store/auth/auth.store';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '../contexts/ThemeContext';
import {Button} from './ui/Button';
import {Card} from './ui/Card';
import {Badge, BadgeProps} from './ui/Badge';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
    const {currentTheme} = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

    const getRoleBadgeVariant = (role: string): BadgeProps['variant'] => {
    switch (role?.toUpperCase()) {
      case 'ROLE_ADMIN':
          return 'purple';
      case 'ROLE_EDITOR':
          return 'info';
      case 'ROLE_USER':
          return 'success';
      default:
          return 'default';
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
        <Button
            variant="ghost"
            size="md"
        onClick={() => setIsOpen(!isOpen)}
        title={user.username}
      >
        <User className="w-6 h-6" />
        </Button>

      {isOpen && (
          <Card elevated padding="none" className="absolute right-0 mt-2 w-72 z-50">
              <div className="p-4 border-b" style={{borderColor: currentTheme.colors.border.primary}}>
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{backgroundColor: currentTheme.colors.background.secondary}}
                >
                    <User className="w-6 h-6" style={{color: currentTheme.colors.text.secondary}}/>
              </div>
              <div className="flex-1 min-w-0">
                  <p
                      className="text-sm font-medium truncate"
                      style={{color: currentTheme.colors.text.primary}}
                  >
                  {user.username}
                </p>
                  <p
                      className="text-xs truncate"
                      style={{color: currentTheme.colors.text.tertiary}}
                  >
                  {user.email}
                </p>
              </div>
            </div>
                  <div className="mt-3 flex flex-wrap gap-2">
              {user.roles.map((role) => (
                  <Badge
                  key={role}
                  variant={getRoleBadgeVariant(role)}
                  size="sm"
                >
                  {role.replace('ROLE_', '')}
                  </Badge>
              ))}
            </div>
          </div>

          <div className="p-2">
              <Button
                  variant="constructive"
              onClick={() => navigate('/settings')}
                  className="w-full justify-start"
                  leftIcon={<Settings className="w-4 h-4"/>}
            >
              Account Settings
              </Button>
              <Button
                  variant="destructive"
              onClick={handleLogout}
                  className="w-full justify-start"
                  leftIcon={<LogOut className="w-4 h-4"/>}
            >
              Sign Out
              </Button>
          </div>
          </Card>
      )}
    </div>
  );
};

export default UserProfile;