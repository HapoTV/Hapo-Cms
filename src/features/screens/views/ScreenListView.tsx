// src/features/screens/views/ScreenListView.tsx

import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Copy, Edit, Monitor, Plus, Trash2} from 'lucide-react';
import {useTheme} from '../../../contexts/ThemeContext';
import {screensService} from '../../../services/screens.service';
import type {PlaylistQueueItem, Screen} from '../../../types/models/screen.types';
import type {ScreenStatus} from '../../../types';

// 1. Import all required components from your central UI library
import {
    Alert,
    Button,
    Dropdown,
    DropdownOption,
    Modal,
    Pagination,
    SearchInput,
    StatusBadge,
    StatusType,
    Table,
    TableColumn,
} from '../../../components/ui';

// 2. Define the status map to connect backend data to frontend components
const screenStatusMap: Record<ScreenStatus, StatusType> = {
    'ONLINE': 'online',
    'OFFLINE': 'offline',
    'MAINTENANCE': 'maintenance',
    'PENDING': 'pending',
    'UNREGISTERED': 'unregistered',
};

export const ScreenListView = () => {
    const {currentTheme} = useTheme();
    const navigate = useNavigate();

    const [allScreens, setAllScreens] = useState<Screen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // 3. Store the full screen object for better context in the modal
    const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchScreens = async () => {
            try {
                setLoading(true);
                // The service call fetches ALL screens at once
                const data = await screensService.getAllScreens();
                setAllScreens(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch screens:', err);
                setError('Could not load screen data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchScreens();
    }, []);

    // Filter screens based on search query
    const filteredScreens = allScreens.filter((screen) =>
        screen.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredScreens.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentScreensOnPage = filteredScreens.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDeleteClick = (screen: Screen) => {
        setSelectedScreen(screen);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedScreen || !selectedScreen.id) return;
        try {
            await screensService.deleteScreenPermanent(selectedScreen.id);
            setAllScreens(allScreens.filter(s => s.id !== selectedScreen.id));
        } catch (err) {
            console.error('Failed to delete screen:', err);
            setError('Failed to delete screen. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setSelectedScreen(null);
        }
    };

    const getActivePlaylistName = (queue: PlaylistQueueItem[]): string => {
        if (!queue || queue.length === 0) return 'None';
        const activePlaylist = queue.find(p => p.isActive);
        return activePlaylist ? activePlaylist.playlistName : 'None';
    };

    const getDropdownOptions = (): DropdownOption[] => [
        {value: 'edit', label: 'Edit Screen', icon: <Edit size={16}/>},
        {value: 'duplicate', label: 'Duplicate', icon: <Copy size={16}/>},
        {value: 'delete', label: 'Delete Screen', icon: <Trash2 size={16}/>},
    ];

    const handleDropdownSelect = (value: string, screen: Screen) => {
        if (value === 'edit') navigate(`${screen.id}/edit`);
        if (value === 'delete') handleDeleteClick(screen);
        if (value === 'duplicate') console.log('Duplicate:', screen.name);
    };

    // 4. Define the table columns declaratively
    const columns: TableColumn<Screen>[] = [
        {
            key: 'name',
            title: 'Name',
            render: (_, screen) => (
                <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.sm}}>
                    <Monitor size={18} style={{color: currentTheme.colors.text.tertiary}}/>
                    <Link to={`${screen.id}`}
                          style={{fontWeight: 500, color: currentTheme.colors.brand.primary, textDecoration: 'none'}}>
                        {screen.name}
                    </Link>
                </div>
            ),
        },
        {
            key: 'status',
            title: 'Status',
            render: (_, screen) => <StatusBadge status={screenStatusMap[screen.status] ?? 'info'}/>,
        },
        {
            key: 'type',
            title: 'Type',
            dataIndex: 'type'
        },
        {
            key: 'location',
            title: 'Location',
            render: (_, screen) => screen.location?.name || 'N/A'
        },
        {
            key: 'playlist',
            title: 'Current Playlist',
            render: (_, screen) => getActivePlaylistName(screen.playlistQueue)
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'right',
            render: (_, screen) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                        placeholder="Options"
                        size="sm"
                        options={getDropdownOptions()}
                        onSelect={(value) => handleDropdownSelect(value, screen)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div style={{padding: currentTheme.spacing.xl, maxWidth: '1280px', margin: 'auto'}}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: currentTheme.spacing.lg
            }}>
                <h1 style={{
                    fontSize: currentTheme.typography.fontSize['2xl'],
                    fontWeight: currentTheme.typography.fontWeight.bold,
                    color: currentTheme.colors.text.primary
                }}>
                    Screens
                </h1>
                <Link to="create">
                    <Button variant="primary" leftIcon={<Plus size={20}/>}>
                        Add Screen
                    </Button>
                </Link>
            </div>

            {/* Search Input */}
            <div style={{maxWidth: '400px', marginBottom: currentTheme.spacing.lg}}>
                <SearchInput
                    placeholder="Search screens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                />
            </div>

            {/* Table or Error Alert */}
            {error ? (
                <Alert variant="error" title="Failed to load data">{error}</Alert>
            ) : (
                <Table<Screen>
                    columns={columns}
                    data={currentScreensOnPage}
                    loading={loading}
                    rowKey="id"
                    bordered={false}
                    emptyText="No screens found matching your search."
                />
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredScreens.length}
            />

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Screen"
            >
                <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.md}}>
                    <Alert variant="error">
                        Are you sure you want to delete the screen "{selectedScreen?.name}"? This action is permanent
                        and cannot be undone.
                    </Alert>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: currentTheme.spacing.sm,
                        marginTop: currentTheme.spacing.md
                    }}>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete Screen
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};