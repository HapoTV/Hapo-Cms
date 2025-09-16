import {useState} from 'react';
import {Link} from 'react-router-dom';
// 1. Import 'MoreVertical' for the dropdown trigger icon
import {AlertCircle, ArrowUpRight, Calendar, Copy, Edit, List, Plus, Trash2} from 'lucide-react';
import {useTheme} from '../../../contexts/ThemeContext';

// 1. Import all the necessary components from your central UI library
import {Alert, Button, Modal, SearchInput, StatusBadge, Table, TableColumn, Tooltip,} from '../../../components/ui';

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
    const {currentTheme} = useTheme(); // Use the theme for custom styling if needed
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    const handleDeleteClick = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

    // 2. Define columns for the new <Table> component. This separates table structure from data.
    const columns: TableColumn<Campaign>[] = [
        {
            key: 'name',
            title: 'Campaign Name',
            dataIndex: 'name',
        },
        {
            key: 'startDate',
            title: 'Start Date',
            render: (_, record) => new Date(record.startDate).toLocaleDateString(),
        },
        {
            key: 'endDate',
            title: 'End Date',
            render: (_, record) => new Date(record.endDate).toLocaleDateString(),
        },
        {
            key: 'status',
            title: 'Status',
            // Use the generic StatusBadge directly in the render function
            render: (_, record) => <StatusBadge status={record.status}/>,
        },
        {
            key: 'locations',
            title: 'Locations',
            render: (_, record) => record.locations.join(', '),
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'right',
            // Render all action buttons using the reusable Button and Tooltip components
            render: (_, record) => (
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: currentTheme.spacing.xs}}>
                    <Tooltip content="Edit">
                        <Link to={`${record.id}/edit`}>
                            <Button variant="ghost" size="sm"><Edit size={16}/></Button>
                        </Link>
                    </Tooltip>
                    <Tooltip content="Duplicate">
                        <Button variant="ghost" size="sm"><Copy size={16}/></Button>
                    </Tooltip>
                    <Tooltip content="View Report">
                        <Button variant="ghost" size="sm"><ArrowUpRight size={16}/></Button>
                    </Tooltip>
                    <Tooltip content="View Details">
                        <Button variant="ghost" size="sm"><AlertCircle size={16}/></Button>
                    </Tooltip>
                    <Tooltip content="Delete">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(record)}>
                            <Trash2 size={16}/>
                        </Button>
                    </Tooltip>
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
              {/* 3. Use the <Button> component wrapped in a <Link> for navigation */}
              <Link to="create">
                  <Button variant="primary" leftIcon={<Plus size={20}/>}>
          New Campaign
                  </Button>
        </Link>
      </div>

          <div style={{display: 'flex', gap: currentTheme.spacing.md, marginBottom: currentTheme.spacing.lg}}>
              {/* 4. Replace the old input with the new <SearchInput> component */}
              <div style={{flex: 1, maxWidth: '400px'}}>
                  <SearchInput
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
              <div style={{display: 'flex', gap: currentTheme.spacing.sm}}>
                  {/* 5. Use themed <Button> components for the view toggles */}
                  <Tooltip content="List View">
                      <Button
                          variant={view === 'list' ? 'secondary' : 'ghost'}
            onClick={() => setView('list')}
          >
                          <List size={20}/>
                      </Button>
                  </Tooltip>
                  <Tooltip content="Calendar View">
                      <Button
                          variant={view === 'calendar' ? 'secondary' : 'ghost'}
            onClick={() => setView('calendar')}
          >
                          <Calendar size={20}/>
                      </Button>
                  </Tooltip>
                  </div>
      </div>

          {/* 6. Replace the entire <table> structure with the new <Table> component */}
          <Table<Campaign>
              columns={columns}
              data={mockCampaigns}
              rowKey="id"
              onRowClick={(record) => console.log('Clicked row:', record.name)}
          />

          {/* 7. Implement the delete modal directly using the generic <Modal> component */}
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