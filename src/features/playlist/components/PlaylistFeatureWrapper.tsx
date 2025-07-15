import React, {ReactNode} from 'react';
import {MediaPlayerProvider} from './MediaPlayerProvider';

interface PlaylistFeatureWrapperProps {
    children: ReactNode;
}

/**
 * A wrapper component that provides the MediaPlayerProvider to all playlist feature components
 */
export const PlaylistFeatureWrapper: React.FC<PlaylistFeatureWrapperProps> = ({children}) => {
    return (
        <MediaPlayerProvider>
            {children}
        </MediaPlayerProvider>
    );
};