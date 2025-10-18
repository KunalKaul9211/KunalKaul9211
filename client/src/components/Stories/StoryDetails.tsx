import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  PriorityHigh as PriorityIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { Story, StoryStatus, StoryPriority } from '../../types/Story';

interface StoryDetailsProps {
  open: boolean;
  onClose: () => void;
  story: Story | null;
}

const StoryDetails: React.FC<StoryDetailsProps> = ({
  open,
  onClose,
  story,
}) => {
  if (!story) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            {story.title}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              label={story.status.replace('_', ' ')}
              color={getStatusColor(story.status)}
            />
            <Chip
              label={story.priority}
              color={getPriorityColor(story.priority)}
            />
            {story.isBreaking && (
              <Chip
                label="BREAKING"
                color="error"
                icon={<PriorityIcon />}
              />
            )}
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Content
              </Typography>
              <Typography variant="body1" paragraph>
                {story.content}
              </Typography>
              
              {story.summary && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {story.summary}
                  </Typography>
                </>
              )}
            </Paper>

            {/* Media */}
            {(story.media.images.length > 0 || story.media.videos.length > 0 || story.media.documents.length > 0) && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Media
                </Typography>
                {story.media.images.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Images ({story.media.images.length})
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {story.media.images.map((image, index) => (
                        <Chip
                          key={index}
                          label={image.caption || `Image ${index + 1}`}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {story.media.videos.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Videos ({story.media.videos.length})
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {story.media.videos.map((video, index) => (
                        <Chip
                          key={index}
                          label={video.caption || `Video ${index + 1}`}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                {story.media.documents.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Documents ({story.media.documents.length})
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {story.media.documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc.name || `Document ${index + 1}`}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            )}

            {/* Workflow Timeline */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Workflow Timeline
              </Typography>
              <Timeline>
                <TimelineItem>
                  <TimelineOppositeContent color="text.secondary">
                    {formatDate(story.createdAt)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <EditIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2">Story Created</Typography>
                    <Typography variant="body2" color="text.secondary">
                      By {story.author.fullName}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                
                {story.status !== 'draft' && (
                  <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                      {formatDate(story.updatedAt)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="info">
                        <AssignmentIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">Story Submitted</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Moved to {story.department} department
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
                
                {story.status === 'approved' && (
                  <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">
                      {formatDate(story.updatedAt)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="success">
                        <CheckCircleIcon />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">Story Approved</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ready for broadcast
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Story Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Story Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Author"
                    secondary={story.author.fullName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department"
                    secondary={story.department}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created"
                    secondary={formatDate(story.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last Updated"
                    secondary={getTimeAgo(story.updatedAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Word Count"
                    secondary={story.metadata.wordCount}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reading Time"
                    secondary={`${story.metadata.readingTime} min`}
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {story.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Assignment */}
            {story.assignedTo && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Assignment
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>
                    {story.assignedTo.firstName.charAt(0)}{story.assignedTo.lastName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {story.assignedTo.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {story.assignedTo.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Scheduling */}
            {story.scheduling && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Scheduling
                </Typography>
                <List dense>
                  {story.scheduling.broadcastAt && (
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Broadcast Time"
                        secondary={formatDate(story.scheduling.broadcastAt)}
                      />
                    </ListItem>
                  )}
                  {story.scheduling.channel && (
                    <ListItem>
                      <ListItemText
                        primary="Channel"
                        secondary={story.scheduling.channel}
                      />
                    </ListItem>
                  )}
                  {story.scheduling.segment && (
                    <ListItem>
                      <ListItemText
                        primary="Segment"
                        secondary={story.scheduling.segment}
                      />
                    </ListItem>
                  )}
                  {story.scheduling.duration && (
                    <ListItem>
                      <ListItemText
                        primary="Duration"
                        secondary={`${story.scheduling.duration} minutes`}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            )}

            {/* Analytics */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Analytics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Views"
                    secondary={story.analytics.views}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Shares"
                    secondary={story.analytics.shares}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Engagement"
                    secondary={story.analytics.engagement}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoryDetails;