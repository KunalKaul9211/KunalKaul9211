import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Story, CreateStoryData, StoryCategory, StoryPriority } from '../../types/Story';

interface StoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (story: Story) => void;
  story?: Story | null;
}

const StoryForm: React.FC<StoryFormProps> = ({
  open,
  onClose,
  onSubmit,
  story,
}) => {
  const [formData, setFormData] = useState<CreateStoryData>({
    title: '',
    content: '',
    summary: '',
    category: 'local',
    priority: 'normal',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        content: story.content,
        summary: story.summary || '',
        category: story.category,
        priority: story.priority,
        tags: story.tags || [],
      });
    } else {
      setFormData({
        title: '',
        content: '',
        summary: '',
        category: 'local',
        priority: 'normal',
        tags: [],
      });
    }
    setErrors({});
  }, [story, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content must be less than 10000 characters';
    }

    if (formData.summary && formData.summary.length > 500) {
      newErrors.summary = 'Summary must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const storyData: Story = {
      id: story?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      category: formData.category,
      priority: formData.priority,
      status: story?.status || 'draft',
      department: story?.department || 'input',
      author: story?.author || {
        id: '1',
        firstName: 'Current',
        lastName: 'User',
        email: 'user@example.com',
      },
      tags: formData.tags,
      createdAt: story?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        wordCount: formData.content.trim().split(/\s+/).length,
        readingTime: Math.ceil(formData.content.trim().split(/\s+/).length / 200),
        language: 'en',
      },
      isBreaking: formData.priority === 'breaking',
      analytics: {
        views: 0,
        shares: 0,
        engagement: 0,
        feedback: {
          positive: 0,
          negative: 0,
          neutral: 0,
        },
      },
      workflow: {
        currentStep: 'creation',
        steps: [],
      },
    };

    onSubmit(storyData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'local',
      priority: 'normal',
      tags: [],
    });
    setNewTag('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {story ? 'Edit Story' : 'Create New Story'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="breaking">Breaking</MenuItem>
                  <MenuItem value="politics">Politics</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="entertainment">Entertainment</MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                  <MenuItem value="world">World</MenuItem>
                  <MenuItem value="local">Local</MenuItem>
                  <MenuItem value="weather">Weather</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="breaking">Breaking</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Summary (optional)"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                error={!!errors.summary}
                helperText={errors.summary || 'Brief summary of the story'}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                error={!!errors.content}
                helperText={errors.content || `${formData.content.length}/10000 characters`}
                multiline
                rows={8}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box display="flex" gap={1}>
                <TextField
                  size="small"
                  label="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tag and press Enter"
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          type="submit"
        >
          {story ? 'Update Story' : 'Create Story'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoryForm;