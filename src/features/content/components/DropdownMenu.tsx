import { useState } from 'react';
import { Copy, Edit, FileText, ListPlus, Monitor, Move, Trash2 } from 'lucide-react';
import { ContentItem } from '../../../types/models/ContentItem';
import { useContentStore } from '../store/content.store';
import { ContentEditModal } from './ContentEditModal'; // Adjust the import path
import { ContentDetailsModal } from './ContentDetailsModal';

interface DropdownMenuProps {
    item: ContentItem;
    onClose: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ item, onClose }) => {
    const { deleteContent, updateContent, duplicateContent, getContentDetails, currentContentDetails} = useContentStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleDelete = async () => {
        onClose(); // Close dropdown immediately
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This also deletes the file from storage and cannot be undone.`)) {
            try {
                await deleteContent(item);
            } catch (error) {
                console.error("Deletion failed:", error);
                alert(error instanceof Error ? error.message : "An unknown error occurred during deletion.");
            }
        }
    };

    const handleEditClick = () => {
       // onClose(); // Close dropdown first
        setIsEditModalOpen(true); // Then open modal
    };

    const handleSave = async (updatedItem: ContentItem) => {
        try {
            await updateContent(item.id!, updatedItem);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
            // Error will be shown in the modal itself
        }
    };

    const handleDuplicate = async () => {
        onClose();
        try {
            await duplicateContent(item);
            console.log("Content duplicated successfully");
        } catch (error) {
            console.error("Duplication failed:", error);
            alert(error instanceof Error ? error.message : "Failed to duplicate content");
        }
    };

    const handleShowDetails = async () => {
        //onClose();
        try {
            if (!item.id) {
                alert("Content ID is missing");
                return;
            }
            
            console.log("Fetching details for ID:", item.id);
            const details = await getContentDetails(item.id);
            
            if (details) {
                setIsDetailsModalOpen(true);
            } else {
                alert("Failed to load content details");
            }
        } catch (error) {
            console.error("Failed to load details:", error);
            alert("Failed to load content details. Please try again.");
        }
    };


    return (
        <>
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-200">
                <ul className="py-1 text-sm text-gray-700">
                    <li 
                        onClick={handleEditClick}
                        className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                    >
                        <Edit className="w-4 h-4 mr-3 text-gray-500" /> Edit
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                        <ListPlus className="w-4 h-4 mr-3 text-gray-500" /> Add to Playlist
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                        <Monitor className="w-4 h-4 mr-3 text-gray-500" /> Set to Screen
                    </li>
                    <li 
                        onClick={handleDuplicate}
                        className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                        <Copy className="w-4 h-4 mr-3 text-gray-500" /> Duplicate
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                        <Move className="w-4 h-4 mr-3 text-gray-500" /> Move
                    </li>
                    <li onClick={handleShowDetails}
                        className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
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

            {/* Edit Modal - rendered outside the dropdown */}
            {isEditModalOpen && (
                <ContentEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                    contentItem={item}
                />
            )}

            {/* Details Modal */}
            {isDetailsModalOpen && (
                <ContentDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    contentItem={currentContentDetails || item}
                />
            )}
        </>
    );
};