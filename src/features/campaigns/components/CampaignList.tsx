// src/features/campaigns/components/CampaignList.tsx

import React, {useState} from 'react';
// 1. Import useNavigate for handling the 'Edit' action
import {Link, useNavigate} from 'react-router-dom';
// 2. Import 'MoreVertical' for the dropdown trigger icon
import {AlertCircle, ArrowUpRight, Calendar, Copy, Edit, List, Plus, Trash2} from 'lucide-react';
import {useTheme} from '../../../contexts/ThemeContext';

// 3. Import Dropdown and its types from your UI library
import {
    Alert,
    Button,
    Dropdown,
    DropdownOption,
    Modal,
    SearchInput,
    StatusBadge,
    Table,
    TableColumn,
} from '../../../components/ui';

// Mock data remains the same
const mockCampaigns = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
      status: 'active' as const, // Added 'as const' for stricter typing with StatusBadge
    locations: ['Store A', 'Store B'],
  },
  {
    id: 2,
    name: 'Back to School',
    startDate: '2024-08-15',
    endDate: '2024-09-15',
      status: 'scheduled' as const,
    locations: ['Store C'],
  },
];

// Define a type for a single campaign for better type safety
type Campaign = typeof mockCampaigns[0];

export const CampaignList = () => {
    const {currentTheme} = useTheme();
    const navigate = useNavigate(); // Hook for navigation
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    const handleDeleteClick = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

    // 4. Define the dropdown options and their corresponding actions
    const getDropdownOptions = (campaign: Campaign): DropdownOption[] => [
        {value: 'edit', label: 'Edit Campaign', icon: <Edit size={16}/>},
        {value: 'duplicate', label: 'Duplicate', icon: <Copy size={16}/>},
        {value: 'report', label: 'View Report', icon: <ArrowUpRight size={16}/>},
        {value: 'details', label: 'View Details', icon: <AlertCircle size={16}/>},
        {value: 'delete', label: 'Delete Campaign', icon: <Trash2 size={16}/>},
    ];

    const handleDropdownSelect = (value: string, campaign: Campaign) => {
        switch (value) {
            case 'edit':
                navigate(`${campaign.id}/edit`);
                break;
            case 'delete':
                handleDeleteClick(campaign);
                break;
            case 'duplicate':
                console.log('Duplicate:', campaign.name);
                break;
            // Add other cases as needed
            default:
                break;
        }
    };

    const columns: TableColumn<Campaign>[] = [
        {key: 'name', title: 'Campaign Name', dataIndex: 'name'},
        {key: 'startDate', title: 'Start Date', render: (_, record) => new Date(record.startDate).toLocaleDateString()},
        {key: 'endDate', title: 'End Date', render: (_, record) => new Date(record.endDate).toLocaleDateString()},
        {key: 'status', title: 'Status', render: (_, record) => <StatusBadge status={record.status}/>},
        {key: 'locations', title: 'Locations', render: (_, record) => record.locations.join(', ')},
        {
            key: 'actions',
            title: 'Actions',
            align: 'right',
            // 5. Replace the row of buttons with the new Dropdown component
            render: (_, record) => (
                // Stop the table's onRowClick event from firing when interacting with the dropdown
                <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                        // 2. Change the placeholder to the desired text.
                        placeholder="Options"
                        // 3. Set the size to 'sm' to make the button fit nicely in the table row.
                        size="sm"
                        options={getDropdownOptions(record)}
                        onSelect={(value) => handleDropdownSelect(value, record)}
                    />
                </div>
            ),
        },
    ];

  return (
      <div style={{padding: currentTheme.spacing['2xl'], maxWidth: '1280px', margin: 'auto'}}>
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: currentTheme.spacing.lg
          }}>
              <h1 style={{
                  fontSize: currentTheme.typography.fontSize['2xl'],
                  fontWeight: currentTheme.typography.fontWeight.bold
              }}>
                  Campaigns
              </h1>
              <Link to="create">
                  <Button variant="primary" leftIcon={<Plus size={20}/>}>
          New Campaign
                  </Button>
        </Link>
      </div>

          <div style={{display: 'flex', gap: currentTheme.spacing.md, marginBottom: currentTheme.spacing.lg}}>
              <div style={{flex: 1, maxWidth: '400px'}}>
                  <SearchInput
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
              <div style={{display: 'flex', gap: currentTheme.spacing.sm}}>
                  <Button variant={view === 'list' ? 'secondary' : 'ghost'} onClick={() => setView('list')}>
                      <List size={20}/>
                      </Button>
                  <Button variant={view === 'calendar' ? 'secondary' : 'ghost'} onClick={() => setView('calendar')}>
                      <Calendar size={20}/>
                      </Button>
                  </div>
      </div>

          <Table<Campaign>
              columns={columns}
              data={mockCampaigns}
              rowKey="id"
              onRowClick={(record) => console.log('Clicked row:', record.name)}
              // Set bordered to false for a cleaner look without vertical gridlines
              bordered={false}
          />

          <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Campaign Deletion"
          >
              <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.md}}>
                  <Alert variant="error">
                      Are you sure you want to delete the campaign "{selectedCampaign?.name}"? This action is permanent
                      and cannot be undone.
                  </Alert>
                  <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: currentTheme.spacing.sm,
                      marginTop: currentTheme.spacing.sm
                  }}>
                      <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                          Cancel
                      </Button>
                      <Button
                          variant="destructive"
                          onClick={() => {
                              // Actual delete logic would go here
          setShowDeleteModal(false);
          setSelectedCampaign(null);
        }}
                      >
                          Delete Campaign
                      </Button>
                  </div>
              </div>
          </Modal>
    </div>
  );
};