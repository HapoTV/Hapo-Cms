import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Copy, ArrowUpRight, AlertCircle, Trash2, Calendar, List } from 'lucide-react';
import { CampaignDeleteModal } from './CampaignDeleteModal';
import { CampaignStatusBadge } from './CampaignStatusBadge';

const mockCampaigns = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'active',
    locations: ['Store A', 'Store B'],
  },
  {
    id: 2,
    name: 'Back to School',
    startDate: '2024-08-15',
    endDate: '2024-09-15',
    status: 'scheduled',
    locations: ['Store C'],
  },
];

export const CampaignList = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

  const handleDelete = (campaignId: number) => {
    setSelectedCampaign(campaignId);
    setShowDeleteModal(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link
          to="create"
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Campaign
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg ${
              view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-lg ${
              view === 'calendar' ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Campaign Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Locations
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <CampaignStatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {campaign.locations.join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    to={`${campaign.id}/edit`}
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 inline-flex"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CampaignDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          // Handle delete
          setShowDeleteModal(false);
          setSelectedCampaign(null);
        }}
      />
    </div>
  );
};