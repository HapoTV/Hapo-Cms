import React, { useState, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Folder, Image, Video, Music, FileText, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const MediaPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Use useCallback to memoize the toggle function
    const toggleSidebar = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 p-8">
                <Routes>
                    <Route path="/media/all" element={<AllMedia />} />
                    <Route path="/media/images" element={<Images />} />
                    <Route path="/media/videos" element={<Videos />} />
                    <Route path="/media/audio" element={<Audio />} />
                    <Route path="/media/documents" element={<Documents />} />
                    <Route path="/media/webpages" element={<WebPages />} />
                </Routes>
            </div>
        </div>
    );
};

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <nav className="flex-1 p-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleSidebar}>
                <h2 className="text-lg font-semibold text-gray-700">Media</h2>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {isOpen && (
                <ul className="space-y-2 mt-2">
                    <NavItem to="/media/all" icon={<Folder className="w-5 h-5 mr-2" />} label="All Media" />
                    <NavItem to="/media/images" icon={<Image className="w-5 h-5 mr-2" />} label="Images" />
                    <NavItem to="/media/videos" icon={<Video className="w-5 h-5 mr-2" />} label="Videos" />
                    <NavItem to="/media/audio" icon={<Music className="w-5 h-5 mr-2" />} label="Audio" />
                    <NavItem to="/media/documents" icon={<FileText className="w-5 h-5 mr-2" />} label="Documents" />
                    <NavItem to="/media/webpages" icon={<Globe className="w-5 h-5 mr-2" />} label="Web Pages" />
                </ul>
            )}
        </nav>
    </div>
);

const NavItem: React.FC<{ to: string; icon: JSX.Element; label: string }> = ({ to, icon, label }) => (
    <li>
        <Link to={to} className="flex items-center text-gray-600 hover:text-blue-600">
            {icon}
            {label}
        </Link>
    </li>
);

const AllMedia = () => (
    <div>
        <h1 className="text-2xl font-bold text-gray-900">All Media</h1>
        {/* Add your table or content here */}
    </div>
);

const Images = () => (
    <div>
        <h1 className="text-2xl font-bold text-gray-900">Images</h1>
        {/* Add your table or content here */}
    </div>
);

const Videos = () => (
    <div>
        <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
        {/* Add your table or content here */}
    </div>
);

const Audio = () => (
    <div>
        <h1 className="text-2xl font-bold text-gray-900">Audio</h1>
        {/* Add your table or content here */}
    </div>
);

const Documents = () => (
    <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        {/* Add your table or content here */}
    </div>
);

const WebPages = () => (
    <div>
        <h1 className="text-2xl font-bold text-gray-900">Web Pages</h1>
        {/* Add your table or content here */}
    </div>
);

export default MediaPage;
