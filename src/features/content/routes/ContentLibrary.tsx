import {useState} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {FileText, Folder, Globe, Image, Music, Plus, Video} from 'lucide-react';
import {ContentUpload} from '../components/ContentUpload';

// Import all your new Tab components
import {AllContentTab} from '../components/tabs/AllContentTab'; // We'll create this next
import {ImagesTab} from '../components/tabs/ImagesTab';
import {VideosTab} from '../components/tabs/VideosTab';
import {AudioTab} from '../components/tabs/AudioTab';
import {DocumentsTab} from '../components/tabs/DocumentsTab';
import {WebPagesTab} from '../components/tabs/WebPagesTab'; // Add this when you create it

// Define our tabs based on the old sidebar
const TABS = [
    {id: 'all', label: 'All Content', icon: <Folder size={16}/>, component: <AllContentTab/>},
    {id: 'images', label: 'Images', icon: <Image size={16}/>, component: <ImagesTab/>},
    {id: 'videos', label: 'Videos', icon: <Video size={16}/>, component: <VideosTab/>},
    {id: 'audio', label: 'Audio', icon: <Music size={16}/>, component: <AudioTab/>},
    {id: 'documents', label: 'Documents', icon: <FileText size={16}/>, component: <DocumentsTab/>},
    {id: 'webpages', label: 'Web Pages', icon: <Globe size={16}/>, component: <WebPagesTab/>},
];

const MainContentView = () => {
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();

    const activeComponent = TABS.find(tab => tab.id === activeTab)?.component;

  return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Content Library</h1>
              <button
                  onClick={() => navigate('/content/upload')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                  <Plus className="w-5 h-5"/>
                  Add Content
              </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  {TABS.map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                              activeTab === tab.id
                                  ? 'border-blue-500 text-blue-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                          {tab.icon}
                          {tab.label}
                      </button>
                  ))}
              </nav>
          </div>

          {/* Tab Content Area */}
          <div className="mt-6">
              {activeComponent}
          </div>
      </div>
  );
};

// This is the top-level router for the content feature
export const ContentLibrary = () => (
    <Routes>
        <Route index element={<MainContentView/>}/>
        <Route path="upload" element={<ContentUpload/>}/>
        {/* Detail view routes can be added here later, e.g., /content/:id */}
    </Routes>
);