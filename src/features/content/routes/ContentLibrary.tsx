import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContentList } from '../components/ContentList';
import { ContentUpload } from '../components/ContentUpload';
import { ContentSidebar } from '../components/ContentSidebar';
import Audio from '../Media/Audio.tsx';
import Document from '../Media/Documents.tsx';
import Images from '../Media/Images.tsx';
import Videos from '../Media/Videos.tsx';
import WebPages from '../Media/WebPages.tsx';


export const ContentLibrary = () => {
  return (
<div className="flex ...">
  <ContentSidebar />  {/* This is ALWAYS visible */}
  <div className="flex-1 p-8"> {/* This is the content area */}
    <Routes>
      {/* 1. The Default/Index Route */}
      <Route index element={<ContentList />} />
      {/* When URL is "/content", show the list. */}

      {/* 2. Routes for the Sidebar Links */}
      <Route path="images" element={<Images />} />
      <Route path="videos" element={<Videos />} />
      <Route path="audio" element={<Audio />} />
      <Route path="documents" element={<Document />} />
      <Route path="webpages" element={<WebPages />} />
      {/* When URL is "/content/images", show the Images component, etc. */}

      {/* 3. A Route for Actions (like uploading) */}
      <Route path="upload" element={<ContentUpload />} />
      {/* When URL is "/content/upload", show the upload form. */}

      {/* 4. A Fallback/Catch-All Route */}
      <Route path="*" element={<ContentList />} />
      {/* If the URL is anything else like "/content/foo", just show the main list. */}
    </Routes>
  </div>
</div>
  );
};