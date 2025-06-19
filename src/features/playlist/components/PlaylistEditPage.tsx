import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlaylistForm } from './PlaylistForm';
import type { Playlist } from '../types';

// Mock data that matches the structure from PlaylistParent
const MOCK_PLAYLISTS = [
    {
        id: '1',
        name: 'Morning Motivation',
        playlistData: {
            startTime: '2024-01-01T08:00:00.000Z',
            endTime: '2024-01-01T10:00:00.000Z',
            repeat: true,
            duration: '1h 45m',
            metadata: {
                priority: 'normal' as const,
                createdBy: 'admin'
            }
        },
        screenIds: [1, 2, 3],
        contentIds: [1, 2, 3, 4, 5],
    },
    {
        id: '2',
        name: 'Workout Mix',
        playlistData: {
            startTime: '2024-01-01T06:00:00.000Z',
            endTime: '2024-01-01T08:00:00.000Z',
            repeat: false,
            duration: '2h 15m',
            metadata: {
                priority: 'high' as const,
                createdBy: 'admin'
            }
        },
        screenIds: [2, 4],
        contentIds: [1, 2, 3, 4, 5, 6, 7],
    },
    {
        id: '3',
        name: 'Focus & Study',
        playlistData: {
            startTime: '2024-01-01T09:00:00.000Z',
            endTime: '2024-01-01T12:30:00.000Z',
            repeat: true,
            duration: '3h 30m',
            metadata: {
                priority: 'low' as const,
                createdBy: 'admin'
            }
        },
        screenIds: [1, 3, 5],
        contentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
];

// This simulates fetching data for a specific playlist ID
const fetchPlaylistById = (id: string): Promise<Playlist | null> => {
    console.log(`Fetching playlist with ID: ${id}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const playlist = MOCK_PLAYLISTS.find(p => p.id === id);
            resolve(playlist || null);
        }, 500); // Simulate network delay
    });
};

export const PlaylistEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchPlaylistById(id)
                .then(data => {
                    setPlaylist(data);
                    if (!data) {
                        console.error(`Playlist with ID ${id} not found`);
                    }
                })
                .catch(error => {
                    console.error('Error fetching playlist:', error);
                })
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleUpdatePlaylist = async (data: any) => {
        if (!id) return;

        setIsSaving(true);
        console.log("Submitting updated data for playlist ID:", id, data);

        try {
            // Transform the data to match backend expectations
            const transformedData = {
                ...data,
                playlistData: {
                    ...data.playlistData,
                    startTime: new Date(data.playlistData.startTime).toISOString(),
                    endTime: new Date(data.playlistData.endTime).toISOString()
                }
            };

            // Mock API call - in real app, use your service
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Playlist updated successfully:', transformedData);
            alert("Playlist updated successfully!");
            navigate('/playlist'); // Go back to the list after saving
        } catch (error) {
            console.error('Error updating playlist:', error);
            alert("Error updating playlist. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading playlist data...</p>
                </div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg mb-4">Playlist not found</p>
                    <p className="text-gray-600 mb-6">Could not find playlist with ID: {id}</p>
                    <button
                        onClick={() => navigate('/playlist')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to Playlists
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/playlist')}
                        className="text-blue-500 hover:text-blue-600 mb-4 flex items-center"
                    >
                        ← Back to Playlists
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Playlist</h1>
                    <p className="text-gray-600">
                        Editing: <span className="font-semibold">{playlist.name}</span>
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg">
                    <PlaylistForm
                        onSubmit={handleUpdatePlaylist}
                        initialData={playlist}
                    />

                    {isSaving && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Saving changes...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};