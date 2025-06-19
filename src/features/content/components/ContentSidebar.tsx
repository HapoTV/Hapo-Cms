// src/features/content/constants.ts
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Folder, Image, Video, Music, FileText, Globe } from 'lucide-react';


const navItems = [
  { path: '/content', icon: <Folder className="w-5 h-5" />, label: 'All Content' },
  { path: '/content/images', icon: <Image className="w-5 h-5" />, label: 'Images' },
  { path: '/content/videos', icon: <Video className="w-5 h-5" />, label: 'Videos' },
  { path: '/content/audio', icon: <Music className="w-5 h-5" />, label: 'Audio' },
  { path: '/content/documents', icon: <FileText className="w-5 h-5" />, label: 'Documents' },
  { path: '/content/webpages', icon: <Globe className="w-5 h-5" />, label: 'Web Pages' },
];

export const ContentSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Library</h2>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};