import React from 'react';
import { Edit, Trash2, Copy, Move, FileText, ListPlus, Monitor } from 'lucide-react';
import { ContentItem } from '../../../types/models/ContentItem';
import { contentService } from '../../../services/content.service';

interface DropdownMenuProps {
    item: ContentItem;
    onDelete: (id: string) => void; // Callback to update the parent's state
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ item, onDelete }) => {
    const handleDelete = async () => {
        // Confirm with the user before deleting
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
            try {
                console.log("Deleting content:", item.id);
                await contentService.deleteContent(item.id);
                // Call the parent's onDelete function to remove the item from the UI
                onDelete(item.id);
                // You could also show a success toast notification here
            } catch (error) {
                console.error("Failed to delete content:", error);
                alert("Failed to delete content. Please try again.");
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