import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CampaignList } from '../components/CampaignList';
import { CampaignCreate } from '../components/CampaignCreate';
import { CampaignEdit } from '../components/CampaignEdit';

export const CampaignManagement = () => {
  return (
    <Routes>
      <Route index element={<CampaignList />} />
      <Route path="create" element={<CampaignCreate />} />
      <Route path=":id/edit" element={<CampaignEdit />} />
    </Routes>
  );
};