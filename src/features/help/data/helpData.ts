import {Calendar, Image, Monitor, PlaySquare, Settings, Shield, Users, Zap} from 'lucide-react';
import type {Category} from '../components/CategoryCard';
import type {Article} from '../components/HelpArticle';

export const helpCategories: Category[] = [
    {
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Learn the basics of using Hapo CMS and set up your first digital signage campaign.',
        icon: Zap,
        articleCount: 8,
        color: 'bg-blue-500'
    },
    {
        id: 'content-management',
        name: 'Content Management',
        description: 'Upload, organize, and manage your media files and content library.',
        icon: Image,
        articleCount: 12,
        color: 'bg-green-500'
    },
    {
        id: 'screen-management',
        name: 'Screen Management',
        description: 'Set up, configure, and monitor your digital displays and screens.',
        icon: Monitor,
        articleCount: 10,
        color: 'bg-purple-500'
    },
    {
        id: 'playlists-campaigns',
        name: 'Playlists & Campaigns',
        description: 'Create engaging playlists and manage your marketing campaigns.',
        icon: PlaySquare,
        articleCount: 15,
        color: 'bg-orange-500'
    },
    {
        id: 'scheduling',
        name: 'Scheduling',
        description: 'Schedule content playback and manage time-based campaigns.',
        icon: Calendar,
        articleCount: 7,
        color: 'bg-indigo-500'
    },
    {
        id: 'user-management',
        name: 'User Management',
        description: 'Manage user accounts, roles, and permissions in your organization.',
        icon: Users,
        articleCount: 6,
        color: 'bg-pink-500'
    },
    {
        id: 'security',
        name: 'Security & Privacy',
        description: 'Learn about security features, data protection, and privacy settings.',
        icon: Shield,
        articleCount: 5,
        color: 'bg-red-500'
    },
    {
        id: 'settings',
        name: 'Settings & Configuration',
        description: 'Configure system settings, preferences, and advanced options.',
        icon: Settings,
        articleCount: 9,
        color: 'bg-gray-500'
    }
];

export const helpArticles: Article[] = [
    // Getting Started
    {
        id: 'welcome-to-hapo-cms',
        title: 'Welcome to Hapo CMS',
        content: `
      <h2>Welcome to Hapo CMS - Your Digital Signage Solution</h2>
      <p>Hapo CMS is a comprehensive digital signage content management system that helps you create, manage, and deploy engaging content across your digital displays.</p>
      
      <h3>What You Can Do</h3>
      <ul>
        <li><strong>Content Management:</strong> Upload and organize images, videos, and other media files</li>
        <li><strong>Screen Control:</strong> Monitor and manage your digital displays remotely</li>
        <li><strong>Campaign Creation:</strong> Design targeted marketing campaigns</li>
        <li><strong>Scheduling:</strong> Plan when and where your content appears</li>
        <li><strong>Analytics:</strong> Track performance and engagement metrics</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>To begin using Hapo CMS:</p>
      <ol>
        <li>Set up your first screen by adding it to the system</li>
        <li>Upload your content to the media library</li>
        <li>Create a playlist with your content</li>
        <li>Schedule your playlist to play on your screens</li>
      </ol>
      
      <p>Need help? Our support team is available 24/7 to assist you with any questions.</p>
    `,
        category: 'Getting Started',
        tags: ['welcome', 'overview', 'basics'],
        author: 'Hapo Team',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        readTime: 3,
        helpful: 45,
        notHelpful: 2
    },
    {
        id: 'first-login-setup',
        title: 'First Login and Account Setup',
        content: `
      <h2>Setting Up Your Account</h2>
      <p>After receiving your login credentials, follow these steps to set up your Hapo CMS account:</p>
      
      <h3>Initial Login</h3>
      <ol>
        <li>Navigate to your Hapo CMS login page</li>
        <li>Enter your email address and temporary password</li>
        <li>You'll be prompted to change your password on first login</li>
        <li>Choose a strong password with at least 8 characters</li>
      </ol>
      
      <h3>Profile Setup</h3>
      <p>Complete your profile information:</p>
      <ul>
        <li>Update your display name</li>
        <li>Set your timezone for accurate scheduling</li>
        <li>Configure notification preferences</li>
        <li>Upload a profile picture (optional)</li>
      </ul>
      
      <h3>Two-Factor Authentication</h3>
      <p>For enhanced security, we recommend enabling two-factor authentication:</p>
      <ol>
        <li>Go to Settings > Security</li>
        <li>Click "Enable 2FA"</li>
        <li>Scan the QR code with your authenticator app</li>
        <li>Enter the verification code to confirm</li>
      </ol>
    `,
        category: 'Getting Started',
        tags: ['login', 'setup', 'security', '2fa'],
        author: 'Sarah Johnson',
        createdAt: '2024-01-16T09:30:00Z',
        updatedAt: '2024-01-20T14:15:00Z',
        readTime: 4,
        helpful: 38,
        notHelpful: 1
    },

    // Content Management
    {
        id: 'uploading-content',
        title: 'How to Upload and Manage Content',
        content: `
      <h2>Content Upload Guide</h2>
      <p>Learn how to upload and organize your media files in Hapo CMS.</p>
      
      <h3>Supported File Types</h3>
      <ul>
        <li><strong>Images:</strong> JPEG, PNG, GIF, BMP, TIFF, SVG</li>
        <li><strong>Videos:</strong> MP4, AVI, MKV, MOV, FLV, WMV, WEBM</li>
        <li><strong>Audio:</strong> MP3, WAV, AAC, FLAC, OGG, WMA, M4A</li>
        <li><strong>Documents:</strong> PDF, DOC, DOCX, PPT, PPTX</li>
      </ul>
      
      <h3>Upload Process</h3>
      <ol>
        <li>Navigate to Content Library</li>
        <li>Click "Add Content" button</li>
        <li>Drag and drop files or click to browse</li>
        <li>Add metadata (title, tags, description)</li>
        <li>Set content duration for videos/images</li>
        <li>Click "Upload" to save</li>
      </ol>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Use descriptive filenames</li>
        <li>Add relevant tags for easy searching</li>
        <li>Optimize file sizes for faster loading</li>
        <li>Use consistent naming conventions</li>
        <li>Organize content into folders by campaign or type</li>
      </ul>
      
      <h3>File Size Limits</h3>
      <p>Maximum file sizes:</p>
      <ul>
        <li>Images: 50MB</li>
        <li>Videos: 500MB</li>
        <li>Audio: 100MB</li>
        <li>Documents: 25MB</li>
      </ul>
    `,
        category: 'Content Management',
        tags: ['upload', 'media', 'files', 'organization'],
        author: 'Mike Chen',
        createdAt: '2024-01-18T11:00:00Z',
        updatedAt: '2024-01-25T16:30:00Z',
        readTime: 5,
        helpful: 52,
        notHelpful: 3
    },

    // Screen Management
    {
        id: 'adding-screens',
        title: 'Adding and Configuring Screens',
        content: `
      <h2>Screen Setup Guide</h2>
      <p>Learn how to add and configure digital displays in your Hapo CMS system.</p>
      
      <h3>Adding a New Screen</h3>
      <ol>
        <li>Go to Screens section</li>
        <li>Click "Add Screen" button</li>
        <li>Enter the screen code displayed on your device</li>
        <li>Provide a descriptive name for the screen</li>
        <li>Set the location information</li>
        <li>Configure screen settings</li>
        <li>Save the configuration</li>
      </ol>
      
      <h3>Screen Settings</h3>
      <p>Configure these important settings:</p>
      <ul>
        <li><strong>Resolution:</strong> Set the display resolution</li>
        <li><strong>Orientation:</strong> Portrait or landscape mode</li>
        <li><strong>Brightness:</strong> Adjust screen brightness</li>
        <li><strong>Volume:</strong> Set audio levels</li>
        <li><strong>Sleep Schedule:</strong> Power management settings</li>
      </ul>
      
      <h3>Screen Status Monitoring</h3>
      <p>Monitor your screens with these status indicators:</p>
      <ul>
        <li><strong>Online:</strong> Screen is connected and active</li>
        <li><strong>Offline:</strong> Screen is not responding</li>
        <li><strong>Maintenance:</strong> Screen is in maintenance mode</li>
        <li><strong>Pending:</strong> Screen is being set up</li>
      </ul>
      
      <h3>Troubleshooting</h3>
      <p>Common issues and solutions:</p>
      <ul>
        <li>Screen not connecting: Check network connection</li>
        <li>Content not updating: Verify screen is online</li>
        <li>Poor image quality: Adjust resolution settings</li>
      </ul>
    `,
        category: 'Screen Management',
        tags: ['screens', 'setup', 'configuration', 'monitoring'],
        author: 'Lisa Rodriguez',
        createdAt: '2024-01-20T13:45:00Z',
        updatedAt: '2024-01-28T10:20:00Z',
        readTime: 6,
        helpful: 41,
        notHelpful: 4
    },

    // Playlists & Campaigns
    {
        id: 'creating-playlists',
        title: 'Creating and Managing Playlists',
        content: `
      <h2>Playlist Creation Guide</h2>
      <p>Playlists are collections of content that play in sequence on your screens.</p>
      
      <h3>Creating a New Playlist</h3>
      <ol>
        <li>Navigate to Playlists section</li>
        <li>Click "Create Playlist"</li>
        <li>Enter playlist name and description</li>
        <li>Add content from your library</li>
        <li>Set duration for each content item</li>
        <li>Arrange content in desired order</li>
        <li>Configure playlist settings</li>
        <li>Save and publish</li>
      </ol>
      
      <h3>Playlist Settings</h3>
      <ul>
        <li><strong>Loop:</strong> Repeat playlist continuously</li>
        <li><strong>Shuffle:</strong> Randomize content order</li>
        <li><strong>Transitions:</strong> Effects between content</li>
        <li><strong>Priority:</strong> Playlist importance level</li>
      </ul>
      
      <h3>Content Duration</h3>
      <p>Set how long each item displays:</p>
      <ul>
        <li>Images: 5-60 seconds recommended</li>
        <li>Videos: Use full video length or trim</li>
        <li>Documents: 10-30 seconds per page</li>
      </ul>
      
      <h3>Best Practices</h3>
      <ul>
        <li>Keep playlists focused on specific themes</li>
        <li>Balance content types for engagement</li>
        <li>Test playlists before deployment</li>
        <li>Update content regularly</li>
        <li>Monitor playlist performance</li>
      </ul>
    `,
        category: 'Playlists & Campaigns',
        tags: ['playlists', 'content', 'sequencing', 'management'],
        author: 'David Park',
        createdAt: '2024-01-22T15:20:00Z',
        updatedAt: '2024-01-30T09:45:00Z',
        readTime: 7,
        helpful: 48,
        notHelpful: 2
    },

    // Scheduling
    {
        id: 'content-scheduling',
        title: 'Scheduling Content and Campaigns',
        content: `
      <h2>Content Scheduling Guide</h2>
      <p>Schedule when your content appears on screens with precise timing control.</p>
      
      <h3>Creating a Schedule</h3>
      <ol>
        <li>Go to Schedules section</li>
        <li>Click "Create Schedule"</li>
        <li>Set start and end dates</li>
        <li>Choose time slots</li>
        <li>Select target screens</li>
        <li>Assign playlists</li>
        <li>Set recurrence rules</li>
        <li>Save schedule</li>
      </ol>
      
      <h3>Schedule Types</h3>
      <ul>
        <li><strong>One-time:</strong> Single occurrence</li>
        <li><strong>Daily:</strong> Repeat every day</li>
        <li><strong>Weekly:</strong> Repeat on specific days</li>
        <li><strong>Monthly:</strong> Repeat monthly</li>
        <li><strong>Custom:</strong> Complex patterns</li>
      </ul>
      
      <h3>Priority Levels</h3>
      <p>Schedule priorities determine which content plays:</p>
      <ul>
        <li><strong>Emergency:</strong> Overrides all other content</li>
        <li><strong>High:</strong> Takes precedence over normal content</li>
        <li><strong>Normal:</strong> Standard priority level</li>
        <li><strong>Low:</strong> Plays when no other content scheduled</li>
      </ul>
      
      <h3>Time Zone Considerations</h3>
      <ul>
        <li>All times are based on your account timezone</li>
        <li>Screens in different zones adjust automatically</li>
        <li>Verify timezone settings for accuracy</li>
      </ul>
    `,
        category: 'Scheduling',
        tags: ['scheduling', 'timing', 'calendar', 'automation'],
        author: 'Emma Thompson',
        createdAt: '2024-01-24T12:10:00Z',
        updatedAt: '2024-02-01T14:25:00Z',
        readTime: 5,
        helpful: 35,
        notHelpful: 1
    }
];

export const getArticlesByCategory = (categoryId: string): Article[] => {
    return helpArticles.filter(article =>
        article.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '') === categoryId
    );
};

export const searchArticles = (query: string): Article[] => {
    if (!query.trim()) return helpArticles;

    const searchTerm = query.toLowerCase();
    return helpArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        article.category.toLowerCase().includes(searchTerm)
    );
};

export const getPopularArticles = (limit: number = 5): Article[] => {
    return helpArticles
        .sort((a, b) => b.helpful - a.helpful)
        .slice(0, limit);
};