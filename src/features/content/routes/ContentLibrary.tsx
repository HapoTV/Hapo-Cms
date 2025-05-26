import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContentList } from '../components/ContentList';
import { ContentUpload } from '../components/ContentUpload';
import { ContentSidebar } from '../components/ContentSidebar';

export const ContentLibrary = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ContentSidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<ContentList />} />
          <Route path="upload" element={<ContentUpload />} />
        </Routes>
      </div>
    </div>
  );
};