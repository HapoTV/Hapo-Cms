import { FileText, Music, Image, Film, Monitor, Clock, Tag, Info, X } from 'lucide-react';
import { ContentItem } from '../../../types/models/ContentItem';

interface ContentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentItem: ContentItem;
}

const getCategoryIcon = (type: string) => {
  switch (type) {
    case 'AUDIO':
      return <Music className="text-blue-500" size={20} />;
    case 'IMAGE':
      return <Image className="text-green-500" size={20} />;
    case 'VIDEO':
      return <Film className="text-purple-500" size={20} />;
    case 'DOCUMENT':
      return <FileText className="text-yellow-500" size={20} />;
    default:
      return <Info className="text-gray-500" size={20} />;
  }
};

export const ContentDetailsModal = ({ isOpen, onClose, contentItem }: ContentDetailsModalProps) => {
  console.log('Modal isOpen:', isOpen);
  console.log('Content item:', contentItem);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {getCategoryIcon(contentItem.type)}
            <h2 className="text-xl font-semibold text-gray-800">{contentItem.name}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview Section */}
            <div className="col-span-1">
              <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                {contentItem.type === 'IMAGE' ? (
                  <img 
                    src={contentItem.url} 
                    alt={contentItem.name}
                    className="w-full h-full object-contain"
                  />
                ) : contentItem.type === 'VIDEO' ? (
                  <video 
                    src={contentItem.url} 
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    {getCategoryIcon(contentItem.type)}
                    <p className="mt-2">No preview available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="col-span-1 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Info size={18} className="text-gray-500" /> Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium capitalize">{contentItem.type.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Uploaded</p>
                    <p className="font-medium">
                      {new Date(contentItem.uploadDate as string).toLocaleDateString()}
                    </p>
                  </div>
                  {contentItem.duration && (
                    <div>
                      <p className="text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> Duration
                      </p>
                      <p className="font-medium">
                        {Math.floor(contentItem.duration / 60)}m {contentItem.duration % 60}s
                      </p>
                    </div>
                  )}
                  {contentItem.campaignId && (
                    <div>
                      <p className="text-gray-500">Campaign ID</p>
                      <p className="font-medium">{contentItem.campaignId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata Section */}
              {contentItem.metadata && Object.keys(contentItem.metadata).length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <FileText size={18} className="text-gray-500" /> Metadata
                  </h3>
                  <div className="bg-gray-50 rounded-md p-3 text-sm">
                    {Object.entries(contentItem.metadata).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 gap-2 py-1">
                        <span className="text-gray-500 capitalize">{key}:</span>
                        <span className="col-span-2 font-medium">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {contentItem.tags && Object.keys(contentItem.tags).length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Tag size={18} className="text-gray-500" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(contentItem.tags).map(([key, value]) => (
                      <span 
                        key={key} 
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Screens Section */}
              {contentItem.screenIds && contentItem.screenIds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Monitor size={18} className="text-gray-500" /> Assigned Screens
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contentItem.screenIds.map(screenId => (
                      <span 
                        key={screenId} 
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                      >
                        Screen #{screenId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};