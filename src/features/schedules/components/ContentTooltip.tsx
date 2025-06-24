import React, {useEffect, useState} from 'react';
import {Clock, PlaySquare, Tag} from 'lucide-react';
import {contentService} from '../../../services/content.service';
import type {Content} from '../../../types/models/ContentItem';

interface ContentTooltipProps {
    contentId: number;
}

export const ContentTooltip: React.FC<ContentTooltipProps> = ({ contentId }) => {
    const [content, setContent] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const contentItem = await contentService.getContentById(contentId);
                setContent({
                    id: String(contentItem.id),
                    name: contentItem.name,
                    type: contentItem.type as 'image' | 'video' | 'audio' | 'document',
                    url: contentItem.url,
                    tags: contentItem.tags ?? [],
                    createdAt: contentItem.uploadDate || new Date().toISOString(),
                    userId: 'N/A', // Not available in ContentItem
                    metadata: {duration: contentItem.duration},
                });
            } catch (error) {
                console.error('Failed to fetch content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [contentId]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-lg">
                <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (!content) {
        return null;
    }

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-2">
                <PlaySquare className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{content.name}</span>
            </div>
            <div className="text-sm text-gray-600">
                <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Created: {new Date(content.createdAt).toLocaleDateString()}
                </p>
                {content.tags.length > 0 && (
                    <p className="flex items-center gap-1 mt-1">
                        <Tag className="w-3 h-3" />
                        {content.tags.join(', ')}
                    </p>
                )}
            </div>
        </div>
    );
};