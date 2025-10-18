import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
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
      id={`output-tabpanel-${index}`}
      aria-labelledby={`output-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const OutputWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
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
        status: 'under_review',
        department: 'output',
        author: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        assignedTo: {
          id: user?.id || '2',
          firstName: user?.firstName || 'Jane',
          lastName: user?.lastName || 'Smith',
          email: user?.email || 'jane@example.com',
        },
        reviewers: [{
          user: {
            id: user?.id || '2',
            firstName: user?.firstName || 'Jane',
            lastName: user?.lastName || 'Smith',
            email: user?.email || 'jane@example.com',
          },
          status: 'pending',
        }],
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
        status: 'approved',
        department: 'output',
        author: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        assignedTo: {
          id: user?.id || '2',
          firstName: user?.firstName || 'Jane',
          lastName: user?.lastName || 'Smith',
          email: user?.email || 'jane@example.com',
        },
        reviewers: [{
          user: {
            id: user?.id || '2',
            firstName: user?.firstName || 'Jane',
            lastName: user?.lastName || 'Smith',
            email: user?.email || 'jane@example.com',
          },
          status: 'approved',
          comments: 'Great story, well written',
          reviewedAt: new Date().toISOString(),
        }],
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
      case 1: // Under Review
        filtered = filtered.filter(story => story.status === 'under_review');
        break;
      case 2: // Approved
        filtered = filtered.filter(story => story.status === 'approved');
        break;
      case 3: // Rejected
        filtered = filtered.filter(story => story.status === 'rejected');
        break;
      case 4: // My Assignments
        filtered = filtered.filter(story => story.assignedTo?.id === user?.id);
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
  }, [stories, tabValue, filterStatus, filterPriority, searchQuery, user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReview = (story: Story, action: 'approve' | 'reject') => {
    setSelectedStory(story);
    setReviewAction(action);
    setReviewComment('');
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (selectedStory) {
      const updatedStories = stories.map(story => {
        if (story.id === selectedStory.id) {
          const updatedReviewers = story.reviewers?.map(reviewer => {
            if (reviewer.user.id === user?.id) {
              return {
                ...reviewer,
                status: reviewAction,
                comments: reviewComment,
                reviewedAt: new Date().toISOString(),
              };
            }
            return reviewer;
          }) || [];

          return {
            ...story,
            status: reviewAction === 'approve' ? 'approved' : 'rejected',
            reviewers: updatedReviewers,
            updatedAt: new Date().toISOString(),
          };
        }
        return story;
      });

      setStories(updatedStories);
      setSuccess(`Story ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully`);
      setIsReviewDialogOpen(false);
    }
  };

  const handleAssignToMe = (story: Story) => {
    const updatedStories = stories.map(s => {
      if (s.id === story.id) {
        return {
          ...s,
          assignedTo: user,
          status: 'under_review',
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    setStories(updatedStories);
    setSuccess('Story assigned to you successfully');
  };

  const getStatusColor = (status: StoryStatus) => {
    switch (status) {
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'under_review': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'scheduled': return 'info';
      case 'broadcasted': return 'success';
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

  const getReviewStatus = (story: Story) => {
    const myReview = story.reviewers?.find(r => r.user.id === user?.id);
    if (!myReview) return 'Not Assigned';
    return myReview.status === 'pending' ? 'Pending Review' : 
           myReview.status === 'approved' ? 'Approved' : 'Rejected';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box width="100%">
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>Loading stories...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Output Workspace
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
              <SelectMenuItem value="submitted">Submitted</SelectMenuItem>
              <SelectMenuItem value="under_review">Under Review</SelectMenuItem>
              <SelectMenuItem value="approved">Approved</SelectMenuItem>
              <SelectMenuItem value="rejected">Rejected</SelectMenuItem>
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
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="output workspace tabs">
            <Tab label={`All (${stories.length})`} />
            <Tab label={`Under Review (${stories.filter(s => s.status === 'under_review').length})`} />
            <Tab label={`Approved (${stories.filter(s => s.status === 'approved').length})`} />
            <Tab label={`Rejected (${stories.filter(s => s.status === 'rejected').length})`} />
            <Tab label={`My Assignments (${stories.filter(s => s.assignedTo?.id === user?.id).length})`} />
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
                        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
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
                          <Chip
                            label={getReviewStatus(story)}
                            color={getReviewStatus(story) === 'Approved' ? 'success' : 
                                   getReviewStatus(story) === 'Rejected' ? 'error' : 'warning'}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setSelectedStory(story);
                          setAnchorEl(e.currentTarget);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {story.summary || story.content.substring(0, 100) + '...'}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="caption" color="text.secondary">
                        By {story.author.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {story.metadata.wordCount} words
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1} flexWrap="wrap">
                      {story.assignedTo ? (
                        <Chip
                          icon={<AssignmentIcon />}
                          label={`Assigned to ${story.assignedTo.fullName}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AssignmentIcon />}
                          onClick={() => handleAssignToMe(story)}
                        >
                          Assign to Me
                        </Button>
                      )}
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
                  <Card sx={{ height: '100%', position: 'relative' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {story.title}
                          </Typography>
                          <Box display="flex" gap={1} mb={1} flexWrap="wrap">
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
                            setAnchorEl(e.currentTarget);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {story.summary || story.content.substring(0, 100) + '...'}
                      </Typography>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="caption" color="text.secondary">
                          By {story.author.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {story.metadata.wordCount} words
                        </Typography>
                      </Box>

                      <Box display="flex" gap={1} flexWrap="wrap">
                        {story.status === 'under_review' && story.assignedTo?.id === user?.id && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<ApproveIcon />}
                              onClick={() => handleReview(story, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<RejectIcon />}
                              onClick={() => handleReview(story, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {!story.assignedTo && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AssignmentIcon />}
                            onClick={() => handleAssignToMe(story)}
                          >
                            Assign to Me
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        ))}
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setAnchorEl(null); }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); }}>
          <ListItemIcon>
            <ScheduleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Schedule</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reviewAction === 'approve' ? 'Approve' : 'Reject'} Story
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {reviewAction === 'approve' 
              ? 'Are you sure you want to approve this story?'
              : 'Are you sure you want to reject this story?'
            }
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comments (optional)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color={reviewAction === 'approve' ? 'success' : 'error'}
          >
            {reviewAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default OutputWorkspace;