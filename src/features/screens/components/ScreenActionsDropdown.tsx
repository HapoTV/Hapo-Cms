import React from 'react';
import {Edit, Trash2} from 'lucide-react';
import {Link} from 'react-router-dom';
import type {Screen} from '../../../types/models/screen.types';

interface ScreenActionsDropdownProps {
    screen: Screen;
    onDelete: (screenId: number) => void;
    onClose: () => void;
}

export const ScreenActionsDropdown: React.FC<ScreenActionsDropdownProps> = ({
                                                                                screen,
                                                                                onDelete,
                                                                                onClose
                                                                            }) => {
    const handleDelete = () => {
        onClose();
        onDelete(screen.id!);
    };

    return (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-200">
            <ul className="py-1 text-sm text-gray-700">
                <li>
                    <Link
                        to={`${screen.id}/edit`}
                        className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                        onClick={onClose}
                    >
                        <Edit className="w-4 h-4 mr-3 text-gray-500"/>
                        Edit
                    </Link>
                </li>
                <div className="my-1 border-t border-gray-100"></div>
                <li
                    onClick={handleDelete}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center cursor-pointer"
                >
                    <Trash2 className="w-4 h-4 mr-3"/>
                    Delete
                </li>
            </ul>
        </div>
    );
};