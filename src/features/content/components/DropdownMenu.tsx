import React from 'react';
import {Copy, Edit, FileText, ListPlus, Monitor, Move, Trash2} from 'lucide-react';
import {ContentItem} from '../../../types/models/ContentItem';
import {useContentStore} from '../store/content.store'; // Import the store

interface DropdownMenuProps {
    item: ContentItem;
    onClose: () => void; // Add a callback to close the dropdown
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({item, onClose}) => {
    // Get the delete action from our store
    const {deleteContent} = useContentStore();

    const handleDelete = async () => {
        onClose(); // Close dropdown immediately for better UX
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This also deletes the file from storage and cannot be undone.`)) {
            try {
                // Call the store action. It handles everything!
                await deleteContent(item);
                // Optionally show a success toast here
                // Note: The UI will update automatically because the store's state changes.
            } catch (error) {
                console.error("Deletion failed:", error);
                alert(error instanceof Error ? error.message : "An unknown error occurred during deletion.");
            }
        }
    };

  return (
    // THE FIX: Increased z-index to ensure it's on top of other elements
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-200">
      <ul className="py-1 text-sm text-gray-700">
        <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
          <Edit className="w-4 h-4 mr-3 text-gray-500" /> Edit
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
          <ListPlus className="w-4 h-4 mr-3 text-gray-500" /> Add to Playlist
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
          <Monitor className="w-4 h-4 mr-3 text-gray-500" /> Set to Screen
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
          <Copy className="w-4 h-4 mr-3 text-gray-500" /> Duplicate
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
          <Move className="w-4 h-4 mr-3 text-gray-500" /> Move
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
          <FileText className="w-4 h-4 mr-3 text-gray-500" /> Item Details
        </li>
        <div className="my-1 border-t border-gray-100"></div>
        <li
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-3" /> Delete
        </li>
      </ul>
    </div>
  );
};