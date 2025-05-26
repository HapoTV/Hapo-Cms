import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Book,
  HelpCircle,
  Bell,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Clock,
  ThumbsUp,
  X
} from 'lucide-react';

// Mock data for help categories and articles
const helpCategories = [
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: <HelpCircle className="w-5 h-5" />,
    articles: [
      { id: 1, title: 'Common Display Issues', views: 1234, helpful: 92 },
      { id: 2, title: 'Content Not Updating', views: 987, helpful: 88 },
      { id: 3, title: 'Network Connectivity Problems', views: 756, helpful: 95 }
    ]
  },
  {
    id: 'user-guides',
    title: 'User Guides',
    icon: <Book className="w-5 h-5" />,
    articles: [
      { id: 4, title: 'Getting Started with Campaigns', views: 2341, helpful: 97 },
      { id: 5, title: 'Managing Content Library', views: 1654, helpful: 94 },
      { id: 6, title: 'User Roles and Permissions', views: 1432, helpful: 91 }
    ]
  },
  {
    id: 'updates',
    title: 'System Updates',
    icon: <Bell className="w-5 h-5" />,
    articles: [
      { id: 7, title: 'Latest Feature Releases', views: 876, helpful: 89 },
      { id: 8, title: 'Upcoming Maintenance Schedule', views: 654, helpful: 87 },
      { id: 9, title: 'Version History', views: 543, helpful: 93 }
    ]
  }
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('troubleshooting');
  const [showChat, setShowChat] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Help Topics</h2>
        </div>
        <nav className="space-y-1">
          {helpCategories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                  expandedCategory === category.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  {category.icon}
                  <span className="ml-3">{category.title}</span>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {expandedCategory === category.id && (
                <div className="mt-1 ml-4 space-y-1">
                  {category.articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Article Content */}
          {selectedArticle ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedArticle.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Updated 2 days ago</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  <span>{selectedArticle.helpful}% found this helpful</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Common Solutions
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Check your network connection</li>
                  <li>Clear your browser cache</li>
                  <li>Ensure you have the latest version</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {category.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {category.articles.map((article) => (
                      <li key={article.id}>
                        <button
                          onClick={() => setSelectedArticle(article)}
                          className="flex items-center justify-between w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg group"
                        >
                          <span>{article.title}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">Live Support</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 h-96 overflow-y-auto">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="mb-2">Connect with our support team</p>
              <p className="text-sm">Typical response time: 2 minutes</p>
            </div>
          </div>
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;