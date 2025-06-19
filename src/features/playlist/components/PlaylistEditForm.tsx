import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { playlistSchema, type Playlist } from '../types';

// The form will handle a slightly different shape (with strings for IDs)
type PlaylistFormValues = Omit<Playlist, 'screenIds' | 'contentIds'> & {
    screenIds: string;
    contentIds: string;
};

interface PlaylistEditFormProps {
    initialData: Playlist;
    onSubmit: (data: Playlist) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const PlaylistEditForm = ({
                                     initialData,
                                     onSubmit,
                                     onCancel,
                                     isLoading = false,
                                 }: PlaylistEditFormProps) => {

    // Helper to format ISO date to what <input type="datetime-local"> expects
    const formatDateTimeForInput = (isoDate: string) => {
        if (!isoDate) return '';
        // Removes the 'Z' and seconds/milliseconds to match the input format
        return isoDate.slice(0, 16);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PlaylistFormValues>({
        resolver: zodResolver(playlistSchema),
        defaultValues: {
            ...initialData,
            playlistData: {
                ...initialData.playlistData,
                // Format dates for the input fields
                startTime: formatDateTimeForInput(initialData.playlistData.startTime),
                endTime: formatDateTimeForInput(initialData.playlistData.endTime),
            },
            // Convert number arrays to comma-separated strings for the input fields
            screenIds: initialData.screenIds.join(', '),
            contentIds: initialData.contentIds.join(', '),
        },
    });

    const handleFormSubmit: SubmitHandler<PlaylistFormValues> = (data) => {
        // 1. Transform form data back to the required JSON structure
        const transformedData: Playlist = {
            ...data,
            // Convert datetime-local strings back to full ISO strings
            playlistData: {
                ...data.playlistData,
                startTime: new Date(data.playlistData.startTime).toISOString(),
                endTime: new Date(data.playlistData.endTime).toISOString(),
            },
            // Convert comma-separated strings back to arrays of numbers
            screenIds: data.screenIds.split(',').map(id => parseInt(id.trim())).filter(num => !isNaN(num)),
            contentIds: data.contentIds.split(',').map(id => parseInt(id.trim())).filter(num => !isNaN(num)),
        };

        // 2. Call the parent's submit function with the clean data
        onSubmit(transformedData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Playlist Name
                </label>
                <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                    </label>
                    <input
                        id="startTime"
                        type="datetime-local"
                        {...register('playlistData.startTime')}
                        className="block w-full rounded-lg border-gray-300 shadow-sm"
                        disabled={isLoading}
                    />
                    {errors.playlistData?.startTime && <p className="mt-1 text-sm text-red-600">{errors.playlistData.startTime.message}</p>}
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                    </label>
                    <input
                        id="endTime"
                        type="datetime-local"
                        {...register('playlistData.endTime')}
                        className="block w-full rounded-lg border-gray-300 shadow-sm"
                        disabled={isLoading}
                    />
                    {errors.playlistData?.endTime && <p className="mt-1 text-sm text-red-600">{errors.playlistData.endTime.message}</p>}
                </div>
            </div>

            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        {...register('playlistData.repeat')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700">Repeat Playlist</span>
                </label>
            </div>

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                </label>
                <select
                    id="priority"
                    {...register('playlistData.metadata.priority')}
                    className="block w-full rounded-lg border-gray-300 shadow-sm bg-white"
                    disabled={isLoading}
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                </select>
            </div>

            <div>
                <label htmlFor="screenIds" className="block text-sm font-medium text-gray-700 mb-1">
                    Screen IDs
                </label>
                <input
                    id="screenIds"
                    type="text"
                    {...register('screenIds')}
                    className="block w-full rounded-lg border-gray-300 shadow-sm"
                    placeholder="e.g., 2, 8"
                    disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">Enter screen IDs separated by commas.</p>
                {errors.screenIds && <p className="mt-1 text-sm text-red-600">{errors.screenIds.message}</p>}
            </div>

            <div>
                <label htmlFor="contentIds" className="block text-sm font-medium text-gray-700 mb-1">
                    Content IDs
                </label>
                <input
                    id="contentIds"
                    type="text"
                    {...register('contentIds')}
                    className="block w-full rounded-lg border-gray-300 shadow-sm"
                    placeholder="e.g., 4, 5"
                    disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">Enter content IDs separated by commas.</p>
                {errors.contentIds && <p className="mt-1 text-sm text-red-600">{errors.contentIds.message}</p>}
            </div>

            <div className="flex justify-end items-center gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};