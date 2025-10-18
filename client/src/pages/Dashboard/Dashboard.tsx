import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LiveTv as LiveTvIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface DashboardStats {
  totalStories: number;
  myStories: number;
  pendingReview: number;
  scheduledBroadcasts: number;
  liveBroadcasts: number;
  completedToday: number;
}

interface RecentActivity {
  id: string;
  type: 'story_created' | 'story_approved' | 'story_rejected' | 'broadcast_started' | 'broadcast_completed';
  title: string;
  timestamp: string;
  user: string;
  department: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [stats, setStats] = useState<DashboardStats>({
    totalStories: 0,
    myStories: 0,
    pendingReview: 0,
    scheduledBroadcasts: 0,
    liveBroadcasts: 0,
    completedToday: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockStats: DashboardStats = {
      totalStories: 156,
      myStories: 23,
      pendingReview: 8,
      scheduledBroadcasts: 12,
      liveBroadcasts: 2,
      completedToday: 45,
    };

    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'story_created',
        title: 'Breaking: Major Economic Policy Change',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        user: 'John Doe',
        department: 'input',
      },
      {
        id: '2',
        type: 'story_approved',
        title: 'Local Sports Team Wins Championship',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'Jane Smith',
        department: 'output',
      },
      {
        id: '3',
        type: 'broadcast_started',
        title: 'Evening News Update',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        user: 'Mike Johnson',
        department: 'playout',
      },
      {
        id: '4',
        type: 'story_rejected',
        title: 'Weather Forecast Update',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user: 'Sarah Wilson',
        department: 'output',
      },
      {
        id: '5',
        type: 'broadcast_completed',
        title: 'Morning Briefing',
        timestamp: new Date(Date.now() - 9000000).toISOString(),
        user: 'Tom Brown',
        department: 'playout',
      },
    ];

    setStats(mockStats);
    setRecentActivity(mockActivity);
    setLoading(false);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'story_created':
        return <AssignmentIcon color="primary" />;
      case 'story_approved':
        return <CheckCircleIcon color="success" />;
      case 'story_rejected':
        return <ErrorIcon color="error" />;
      case 'broadcast_started':
        return <LiveTvIcon color="error" />;
      case 'broadcast_completed':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'story_created':
        return 'primary';
      case 'story_approved':
        return 'success';
      case 'story_rejected':
        return 'error';
      case 'broadcast_started':
        return 'error';
      case 'broadcast_completed':
        return 'success';
      default:
        return 'info';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box width="100%">
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>Loading dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {user?.department?.charAt(0).toUpperCase() + user?.department?.slice(1)} Department
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.totalStories}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Stories
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.myStories}
                  </Typography>
                  <Typography color="text.secondary">
                    My Stories
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.pendingReview}
                  </Typography>
                  <Typography color="text.secondary">
                    Pending Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <LiveTvIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.liveBroadcasts}
                  </Typography>
                  <Typography color="text.secondary">
                    Live Broadcasts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1">
                              {activity.title}
                            </Typography>
                            <Chip
                              label={activity.type.replace('_', ' ')}
                              color={getActivityColor(activity.type) as any}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.user} • {activity.department}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(activity.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications ({unreadCount})
              </Typography>
              <List>
                {notifications.slice(0, 5).map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem>
                      <ListItemIcon>
                        {notification.type === 'success' && <CheckCircleIcon color="success" />}
                        {notification.type === 'error' && <ErrorIcon color="error" />}
                        {notification.type === 'warning' && <WarningIcon color="warning" />}
                        {notification.type === 'info' && <InfoIcon color="info" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(notification.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < Math.min(notifications.length, 5) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <BusinessIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Input Department</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Story Creation & Submission
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {stats.totalStories}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <AssignmentIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Output Department</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Editorial Review & Approval
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {stats.pendingReview}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <LiveTvIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Playout Department</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Broadcast Management
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {stats.liveBroadcasts}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;