import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { Story, StoryStatus, StoryPriority } from '../../types/Story';

interface StoryCardProps {
  story: Story;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  onSchedule?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onAssign?: () => void;
  showActions?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onEdit,
  onView,
  onDelete,
  onSchedule,
  onApprove,
  onReject,
  onAssign,
  showActions = true,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
    return new Date(dateString).toLocaleDateString();
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
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
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
          {showActions && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          )}
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

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="caption" color="text.secondary">
            {formatDate(story.createdAt)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getTimeAgo(story.updatedAt)}
          </Typography>
        </Box>

        {story.tags && story.tags.length > 0 && (
          <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
            {story.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
            {story.tags.length > 3 && (
              <Chip
                label={`+${story.tags.length - 3} more`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {story.assignedTo && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AssignmentIcon fontSize="small" color="primary" />
            <Typography variant="caption" color="text.secondary">
              Assigned to {story.assignedTo.fullName}
            </Typography>
          </Box>
        )}

        {story.scheduling?.broadcastAt && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ScheduleIcon fontSize="small" color="info" />
            <Typography variant="caption" color="text.secondary">
              Scheduled: {new Date(story.scheduling.broadcastAt).toLocaleString()}
            </Typography>
          </Box>
        )}

        {showActions && (
          <Box display="flex" gap={1} flexWrap="wrap">
            {onView && (
              <Tooltip title="View Details">
                <IconButton size="small" onClick={onView}>
                  <ViewIcon />
                </IconButton>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip title="Edit Story">
                <IconButton size="small" onClick={onEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {onSchedule && story.status === 'approved' && (
              <Tooltip title="Schedule Broadcast">
                <IconButton size="small" onClick={onSchedule}>
                  <ScheduleIcon />
                </IconButton>
              </Tooltip>
            )}
            {onApprove && story.status === 'under_review' && (
              <Tooltip title="Approve Story">
                <IconButton size="small" onClick={onApprove} color="success">
                  <ApproveIcon />
                </IconButton>
              </Tooltip>
            )}
            {onReject && story.status === 'under_review' && (
              <Tooltip title="Reject Story">
                <IconButton size="small" onClick={onReject} color="error">
                  <RejectIcon />
                </IconButton>
              </Tooltip>
            )}
            {onAssign && !story.assignedTo && (
              <Tooltip title="Assign to Me">
                <IconButton size="small" onClick={onAssign}>
                  <AssignmentIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {onView && (
            <MenuItem onClick={() => { onView(); handleMenuClose(); }}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
          )}
          {onEdit && (
            <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          )}
          {onSchedule && story.status === 'approved' && (
            <MenuItem onClick={() => { onSchedule(); handleMenuClose(); }}>
              <ListItemIcon>
                <ScheduleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Schedule</ListItemText>
            </MenuItem>
          )}
          {onAssign && !story.assignedTo && (
            <MenuItem onClick={() => { onAssign(); handleMenuClose(); }}>
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Assign to Me</ListItemText>
            </MenuItem>
          )}
          {onDelete && (
            <MenuItem onClick={() => { onDelete(); handleMenuClose(); }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </CardContent>
    </Card>
  );
};

export default StoryCard;