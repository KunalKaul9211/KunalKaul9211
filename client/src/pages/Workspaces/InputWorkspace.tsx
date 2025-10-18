import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Fab,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import StoryCard from '../../components/Stories/StoryCard';
import StoryForm from '../../components/Stories/StoryForm';
import StoryDetails from '../../components/Stories/StoryDetails';
import { Story, StoryStatus, StoryPriority } from '../../types/Story';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`input-tabpanel-${index}`}
      aria-labelledby={`input-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const InputWorkspace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState<StoryStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<StoryPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: '1',
        title: 'Breaking: Major Economic Policy Change',
        content: 'The government announced significant changes to economic policy...',
        summary: 'New economic measures to boost growth',
        category: 'breaking',
        priority: 'urgent',
        status: 'draft',
        department: 'input',
        author: {
          id: user?.id || '1',
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john@example.com',
        },
        tags: ['economy', 'policy', 'breaking'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          wordCount: 250,
          readingTime: 2,
          language: 'en',
        },
        isBreaking: true,
      },
      {
        id: '2',
        title: 'Local Sports Team Wins Championship',
        content: 'The hometown team secured their first championship in 20 years...',
        summary: 'Historic victory for local sports team',
        category: 'sports',
        priority: 'normal',
        status: 'submitted',
        department: 'input',
        author: {
          id: user?.id || '1',
          firstName: user?.firstName || 'John',
          lastName: user?.lastName || 'Doe',
          email: user?.email || 'john@example.com',
        },
        tags: ['sports', 'championship', 'local'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        metadata: {
          wordCount: 180,
          readingTime: 1,
          language: 'en',
        },
        isBreaking: false,
      },
    ];
    
    setStories(mockStories);
    setFilteredStories(mockStories);
    setLoading(false);
  }, [user]);

  // Filter stories based on current tab and filters
  useEffect(() => {
    let filtered = stories;

    // Filter by tab (status)
    switch (tabValue) {
      case 0: // All
        break;
      case 1: // Draft
        filtered = filtered.filter(story => story.status === 'draft');
        break;
      case 2: // Submitted
        filtered = filtered.filter(story => story.status === 'submitted');
        break;
      case 3: // Under Review
        filtered = filtered.filter(story => story.status === 'under_review');
        break;
      case 4: // Approved
        filtered = filtered.filter(story => story.status === 'approved');
        break;
    }

    // Apply additional filters
    if (filterStatus !== 'all') {
      filtered = filtered.filter(story => story.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(story => story.priority === filterPriority);
    }

    if (searchQuery) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredStories(filtered);
  }, [stories, tabValue, filterStatus, filterPriority, searchQuery]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateStory = () => {
    setSelectedStory(null);
    setIsFormOpen(true);
  };

  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setIsFormOpen(true);
  };

  const handleViewStory = (story: Story) => {
    setSelectedStory(story);
    setIsDetailsOpen(true);
  };

  const handleDeleteStory = (storyId: string) => {
    setStories(stories.filter(story => story.id !== storyId));
    setSuccess('Story deleted successfully');
  };

  const handleSubmitStory = (story: Story) => {
    if (selectedStory) {
      // Update existing story
      setStories(stories.map(s => s.id === story.id ? story : s));
      setSuccess('Story updated successfully');
    } else {
      // Create new story
      const newStory = { ...story, id: Date.now().toString() };
      setStories([newStory, ...stories]);
      setSuccess('Story created successfully');
    }
    setIsFormOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: StoryStatus) => {
    switch (status) {
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'under_review': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: StoryPriority) => {
    switch (priority) {
      case 'low': return 'default';
      case 'normal': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      case 'breaking': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading stories...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Input Workspace
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value as StoryStatus | 'all')}
            >
              <SelectMenuItem value="all">All Status</SelectMenuItem>
              <SelectMenuItem value="draft">Draft</SelectMenuItem>
              <SelectMenuItem value="submitted">Submitted</SelectMenuItem>
              <SelectMenuItem value="under_review">Under Review</SelectMenuItem>
              <SelectMenuItem value="approved">Approved</SelectMenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => setFilterPriority(e.target.value as StoryPriority | 'all')}
            >
              <SelectMenuItem value="all">All Priority</SelectMenuItem>
              <SelectMenuItem value="low">Low</SelectMenuItem>
              <SelectMenuItem value="normal">Normal</SelectMenuItem>
              <SelectMenuItem value="high">High</SelectMenuItem>
              <SelectMenuItem value="urgent">Urgent</SelectMenuItem>
              <SelectMenuItem value="breaking">Breaking</SelectMenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="input workspace tabs">
            <Tab label={`All (${stories.length})`} />
            <Tab label={`Draft (${stories.filter(s => s.status === 'draft').length})`} />
            <Tab label={`Submitted (${stories.filter(s => s.status === 'submitted').length})`} />
            <Tab label={`Under Review (${stories.filter(s => s.status === 'under_review').length})`} />
            <Tab label={`Approved (${stories.filter(s => s.status === 'approved').length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {filteredStories.map((story) => (
              <Grid item xs={12} md={6} lg={4} key={story.id}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {story.title}
                        </Typography>
                        <Box display="flex" gap={1} mb={1}>
                          <Chip
                            label={story.status.replace('_', ' ')}
                            color={getStatusColor(story.status)}
                            size="small"
                          />
                          <Chip
                            label={story.priority}
                            color={getPriorityColor(story.priority)}
                            size="small"
                          />
                          {story.isBreaking && (
                            <Chip
                              label="BREAKING"
                              color="error"
                              size="small"
                              icon={<PriorityIcon />}
                            />
                          )}
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setSelectedStory(story);
                          handleMenuOpen(e);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {story.summary || story.content.substring(0, 100) + '...'}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {story.metadata.wordCount} words
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {[1, 2, 3, 4].map((index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            <Grid container spacing={3}>
              {filteredStories.map((story) => (
                <Grid item xs={12} md={6} lg={4} key={story.id}>
                  <StoryCard
                    story={story}
                    onEdit={() => handleEditStory(story)}
                    onView={() => handleViewStory(story)}
                    onDelete={() => handleDeleteStory(story.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        ))}
      </Card>

      <Fab
        color="primary"
        aria-label="add story"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateStory}
      >
        <AddIcon />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleViewStory(selectedStory!); handleMenuClose(); }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleEditStory(selectedStory!); handleMenuClose(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleDeleteStory(selectedStory!.id); handleMenuClose(); }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <StoryForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitStory}
        story={selectedStory}
      />

      <StoryDetails
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        story={selectedStory}
      />

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InputWorkspace;