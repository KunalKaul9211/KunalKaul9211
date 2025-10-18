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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText as MuiListItemText,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Schedule as ScheduleIcon,
  LiveTv as LiveIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
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
      id={`playout-tabpanel-${index}`}
      aria-labelledby={`playout-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface BroadcastItem {
  id: string;
  story: Story;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  channel: string;
  segment: string;
  producer: string;
}

const PlayoutWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [broadcastSchedule, setBroadcastSchedule] = useState<BroadcastItem[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledTime: '',
    duration: 5,
    channel: '',
    segment: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterStatus, setFilterStatus] = useState<StoryStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<StoryPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [currentBroadcast, setCurrentBroadcast] = useState<BroadcastItem | null>(null);

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
        status: 'approved',
        department: 'playout',
        author: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
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
        scheduling: {
          publishAt: new Date(Date.now() + 3600000).toISOString(),
          broadcastAt: new Date(Date.now() + 1800000).toISOString(),
          duration: 3,
          channel: 'Main',
          segment: 'Breaking News',
        },
      },
      {
        id: '2',
        title: 'Local Sports Team Wins Championship',
        content: 'The hometown team secured their first championship in 20 years...',
        summary: 'Historic victory for local sports team',
        category: 'sports',
        priority: 'normal',
        status: 'approved',
        department: 'playout',
        author: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
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
        scheduling: {
          publishAt: new Date(Date.now() + 7200000).toISOString(),
          broadcastAt: new Date(Date.now() + 7200000).toISOString(),
          duration: 5,
          channel: 'Sports',
          segment: 'Sports Update',
        },
      },
    ];

    const mockBroadcastSchedule: BroadcastItem[] = [
      {
        id: '1',
        story: mockStories[0],
        scheduledTime: new Date(Date.now() + 1800000).toISOString(),
        duration: 3,
        status: 'scheduled',
        channel: 'Main',
        segment: 'Breaking News',
        producer: user?.fullName || 'Jane Smith',
      },
      {
        id: '2',
        story: mockStories[1],
        scheduledTime: new Date(Date.now() + 7200000).toISOString(),
        duration: 5,
        status: 'scheduled',
        channel: 'Sports',
        segment: 'Sports Update',
        producer: user?.fullName || 'Jane Smith',
      },
    ];
    
    setStories(mockStories);
    setBroadcastSchedule(mockBroadcastSchedule);
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
      case 1: // Ready for Broadcast
        filtered = filtered.filter(story => story.status === 'approved');
        break;
      case 2: // Scheduled
        filtered = filtered.filter(story => story.scheduling?.broadcastAt);
        break;
      case 3: // Live
        filtered = filtered.filter(story => story.status === 'broadcasted');
        break;
      case 4: // Completed
        filtered = filtered.filter(story => story.status === 'broadcasted');
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

  const handleScheduleStory = (story: Story) => {
    setSelectedStory(story);
    setScheduleData({
      scheduledTime: story.scheduling?.broadcastAt ? 
        new Date(story.scheduling.broadcastAt).toISOString().slice(0, 16) : 
        new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      duration: story.scheduling?.duration || 5,
      channel: story.scheduling?.channel || 'Main',
      segment: story.scheduling?.segment || 'News',
    });
    setIsScheduleDialogOpen(true);
  };

  const handleSubmitSchedule = () => {
    if (selectedStory) {
      const updatedStories = stories.map(story => {
        if (story.id === selectedStory.id) {
          return {
            ...story,
            status: 'scheduled' as StoryStatus,
            scheduling: {
              ...story.scheduling,
              broadcastAt: new Date(scheduleData.scheduledTime).toISOString(),
              duration: scheduleData.duration,
              channel: scheduleData.channel,
              segment: scheduleData.segment,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return story;
      });

      const newBroadcastItem: BroadcastItem = {
        id: `broadcast-${Date.now()}`,
        story: {
          ...selectedStory,
          status: 'scheduled' as StoryStatus,
          scheduling: {
            ...selectedStory.scheduling,
            broadcastAt: new Date(scheduleData.scheduledTime).toISOString(),
            duration: scheduleData.duration,
            channel: scheduleData.channel,
            segment: scheduleData.segment,
          },
        },
        scheduledTime: new Date(scheduleData.scheduledTime).toISOString(),
        duration: scheduleData.duration,
        status: 'scheduled',
        channel: scheduleData.channel,
        segment: scheduleData.segment,
        producer: user?.fullName || 'Unknown',
      };

      setStories(updatedStories);
      setBroadcastSchedule([...broadcastSchedule, newBroadcastItem]);
      setSuccess('Story scheduled for broadcast successfully');
      setIsScheduleDialogOpen(false);
    }
  };

  const handleStartBroadcast = (broadcastItem: BroadcastItem) => {
    setCurrentBroadcast(broadcastItem);
    setIsLive(true);
    
    const updatedSchedule = broadcastSchedule.map(item => {
      if (item.id === broadcastItem.id) {
        return { ...item, status: 'live' as const };
      }
      return item;
    });
    setBroadcastSchedule(updatedSchedule);

    const updatedStories = stories.map(story => {
      if (story.id === broadcastItem.story.id) {
        return { ...story, status: 'broadcasted' as StoryStatus };
      }
      return story;
    });
    setStories(updatedStories);

    setSuccess('Broadcast started successfully');
  };

  const handleStopBroadcast = () => {
    if (currentBroadcast) {
      const updatedSchedule = broadcastSchedule.map(item => {
        if (item.id === currentBroadcast.id) {
          return { ...item, status: 'completed' as const };
        }
        return item;
      });
      setBroadcastSchedule(updatedSchedule);
    }

    setCurrentBroadcast(null);
    setIsLive(false);
    setSuccess('Broadcast stopped successfully');
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

  const getBroadcastStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'live': return 'error';
      case 'completed': return 'success';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box width="100%">
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>Loading broadcast schedule...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Playout Workspace
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          {isLive && currentBroadcast && (
            <Chip
              icon={<LiveIcon />}
              label={`LIVE: ${currentBroadcast.story.title}`}
              color="error"
              variant="filled"
            />
          )}
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
              <SelectMenuItem value="approved">Approved</SelectMenuItem>
              <SelectMenuItem value="scheduled">Scheduled</SelectMenuItem>
              <SelectMenuItem value="broadcasted">Broadcasted</SelectMenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="playout workspace tabs">
                <Tab label={`All (${stories.length})`} />
                <Tab label={`Ready (${stories.filter(s => s.status === 'approved').length})`} />
                <Tab label={`Scheduled (${stories.filter(s => s.scheduling?.broadcastAt).length})`} />
                <Tab label={`Live (${broadcastSchedule.filter(b => b.status === 'live').length})`} />
                <Tab label={`Completed (${broadcastSchedule.filter(b => b.status === 'completed').length})`} />
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
                          {story.status === 'approved' && (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<ScheduleIcon />}
                              onClick={() => handleScheduleStory(story)}
                            >
                              Schedule
                            </Button>
                          )}
                          {story.scheduling?.broadcastAt && (
                            <Chip
                              label={`Scheduled: ${new Date(story.scheduling.broadcastAt).toLocaleString()}`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
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
                            {story.status === 'approved' && (
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<ScheduleIcon />}
                                onClick={() => handleScheduleStory(story)}
                              >
                                Schedule
                              </Button>
                            )}
                            {story.scheduling?.broadcastAt && (
                              <Chip
                                label={`Scheduled: ${new Date(story.scheduling.broadcastAt).toLocaleString()}`}
                                size="small"
                                color="info"
                                variant="outlined"
                              />
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
        </Grid>

        {/* Sidebar - Broadcast Timeline */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Broadcast Timeline
              </Typography>
              <Timeline>
                {broadcastSchedule
                  .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                  .map((item, index) => (
                    <TimelineItem key={item.id}>
                      <TimelineOppositeContent color="text.secondary">
                        {new Date(item.scheduledTime).toLocaleTimeString()}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={getBroadcastStatusColor(item.status)}>
                          {item.status === 'live' ? <LiveIcon /> : 
                           item.status === 'completed' ? <CheckIcon /> :
                           item.status === 'cancelled' ? <ErrorIcon /> : <ScheduleIcon />}
                        </TimelineDot>
                        {index < broadcastSchedule.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {item.story.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {item.channel} - {item.segment}
                          </Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Chip
                              label={item.status}
                              color={getBroadcastStatusColor(item.status)}
                              size="small"
                            />
                            <Typography variant="caption">
                              {item.duration} min
                            </Typography>
                          </Box>
                          {item.status === 'scheduled' && (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<PlayIcon />}
                              onClick={() => handleStartBroadcast(item)}
                              sx={{ mt: 1 }}
                            >
                              Start Broadcast
                            </Button>
                          )}
                          {item.status === 'live' && (
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<StopIcon />}
                              onClick={handleStopBroadcast}
                              sx={{ mt: 1 }}
                            >
                              Stop Broadcast
                            </Button>
                          )}
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setAnchorEl(null); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleScheduleStory(selectedStory!); setAnchorEl(null); }}>
          <ListItemIcon>
            <ScheduleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Schedule</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); }}>
          <ListItemIcon>
            <LiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Go Live</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule Story for Broadcast</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Scheduled Time"
            type="datetime-local"
            value={scheduleData.scheduledTime}
            onChange={(e) => setScheduleData({ ...scheduleData, scheduledTime: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={scheduleData.duration}
            onChange={(e) => setScheduleData({ ...scheduleData, duration: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Channel</InputLabel>
            <Select
              value={scheduleData.channel}
              label="Channel"
              onChange={(e) => setScheduleData({ ...scheduleData, channel: e.target.value })}
            >
              <SelectMenuItem value="Main">Main Channel</SelectMenuItem>
              <SelectMenuItem value="News">News Channel</SelectMenuItem>
              <SelectMenuItem value="Sports">Sports Channel</SelectMenuItem>
              <SelectMenuItem value="Weather">Weather Channel</SelectMenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Segment"
            value={scheduleData.segment}
            onChange={(e) => setScheduleData({ ...scheduleData, segment: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsScheduleDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitSchedule}
            variant="contained"
          >
            Schedule
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

export default PlayoutWorkspace;