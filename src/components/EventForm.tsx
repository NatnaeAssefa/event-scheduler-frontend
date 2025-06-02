import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { EventFormData, RecurrenceFrequency, WeekDay } from '@/types/event';

interface EventFormProps {
  open: boolean;
  event: EventFormData | null;
  onClose: () => void;
  onSave: (eventData: EventFormData) => void;
  onDelete: (eventId: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({ open, event, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    recurrence_frequency: RecurrenceFrequency.NONE,
    is_all_day: false,
    location: '',
    color: '#1976d2',
    recurrence_count: 0,
    recurrence_day_of_month: 1,
    recurrence_day_of_week: 1,
    recurrence_days: [],
    recurrence_end_date: undefined,
    recurrence_interval: 1,
    recurrence_week_of_month: 1
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
        recurrence_end_date: event.recurrence_end_date ? new Date(event.recurrence_end_date) : undefined,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: new Date(),
        end_date: new Date(),
        recurrence_frequency: RecurrenceFrequency.NONE,
        is_all_day: false,
        location: '',
        color: '#1976d2',
        recurrence_count: 0,
        recurrence_day_of_month: 1,
        recurrence_day_of_week: 1,
        recurrence_days: [],
        recurrence_end_date: undefined,
        recurrence_interval: 1,
        recurrence_week_of_month: 1
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (formData.start_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    // Validate recurrence settings only if recurrence is enabled
    if (formData.recurrence_frequency !== RecurrenceFrequency.NONE) {
      if (!formData.recurrence_interval || formData.recurrence_interval < 1) {
        newErrors.recurrence_interval = 'Interval must be at least 1';
      }
      
      if (formData.recurrence_frequency === RecurrenceFrequency.WEEKLY && 
          (!formData.recurrence_days || formData.recurrence_days.length === 0)) {
        newErrors.recurrence_days = 'Select at least one day of the week';
      }

      if (formData.recurrence_frequency === RecurrenceFrequency.MONTHLY) {
        if (!formData.recurrence_day_of_month && !formData.recurrence_week_of_month) {
          newErrors.recurrence_monthly = 'Select either a specific day or relative day of month';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    console.log("Form data - ", formData);
    
    // Clean up form data before submission
    const cleanedFormData = {
      ...formData,
      recurrence_interval: formData.recurrence_frequency === RecurrenceFrequency.NONE ? undefined : formData.recurrence_interval,
      recurrence_days: formData.recurrence_frequency === RecurrenceFrequency.NONE ? undefined : formData.recurrence_days,
      recurrence_day_of_month: formData.recurrence_frequency === RecurrenceFrequency.NONE ? undefined : formData.recurrence_day_of_month,
      recurrence_week_of_month: formData.recurrence_frequency === RecurrenceFrequency.NONE ? undefined : formData.recurrence_week_of_month,
      recurrence_day_of_week: formData.recurrence_frequency === RecurrenceFrequency.NONE ? undefined : formData.recurrence_day_of_week,
      recurrence_end_date: formData.recurrence_frequency === RecurrenceFrequency.NONE ? undefined : formData.recurrence_end_date,
      recurrence_count: formData.recurrence_frequency === RecurrenceFrequency.NONE ? undefined : formData.recurrence_count,
    };

    if (validateForm()) {
      console.log("Form is valid, submitting data:", cleanedFormData);
      onSave(cleanedFormData);
    } else {
      console.log("Form validation failed:", errors);
    }
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  const renderRecurrenceOptions = () => {
    if (formData.recurrence_frequency === RecurrenceFrequency.NONE) {
      return null;
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Recurrence Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <TextField
              fullWidth
              type="number"
              label="Repeat every"
              value={formData.recurrence_interval || 1}
              onChange={(e) =>
                setFormData({ ...formData, recurrence_interval: parseInt(e.target.value) })
              }
              inputProps={{ min: 1 }}
              helperText={`Repeat every ${formData.recurrence_interval || 1} ${
                formData.recurrence_frequency?.toLowerCase() || ''
              }(s)`}
            />
          </Box>

          {formData.recurrence_frequency === RecurrenceFrequency.WEEKLY && (
            <Box>
              <FormControl fullWidth>
                <InputLabel>Days of Week</InputLabel>
                <Select
                  multiple
                  value={formData.recurrence_days || []}
                  onChange={(e) =>
                    setFormData({ ...formData, recurrence_days: e.target.value as number[] })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Typography key={value} variant="body2">
                          {WeekDay[value]}
                        </Typography>
                      ))}
                    </Box>
                  )}
                >
                  {Object.entries(WeekDay)
                    .filter(([key]) => isNaN(Number(key)))
                    .map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {formData.recurrence_frequency === RecurrenceFrequency.MONTHLY && (
            <>
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Repeat On</InputLabel>
                  <Select
                    value={formData.recurrence_day_of_month ? 'specific' : 'relative'}
                    onChange={(e) => {
                      if (e.target.value === 'specific') {
                        setFormData({
                          ...formData,
                          recurrence_day_of_month: new Date(formData.start_date!).getDate(),
                          recurrence_week_of_month: undefined,
                          recurrence_day_of_week: undefined,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          recurrence_day_of_month: undefined,
                          recurrence_week_of_month: Math.ceil(new Date(formData.start_date!).getDate() / 7),
                          recurrence_day_of_week: new Date(formData.start_date!).getDay(),
                        });
                      }
                    }}
                  >
                    <MenuItem value="specific">Specific Day of Month</MenuItem>
                    <MenuItem value="relative">Relative Day of Month</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {formData.recurrence_day_of_month ? (
                <Box>
                  <TextField
                    fullWidth
                    type="number"
                    label="Day of Month"
                    value={formData.recurrence_day_of_month}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurrence_day_of_month: parseInt(e.target.value),
                      })
                    }
                    inputProps={{ min: 1, max: 31 }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>Week of Month</InputLabel>
                      <Select
                        value={formData.recurrence_week_of_month || 1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recurrence_week_of_month: Number(e.target.value),
                          })
                        }
                      >
                        <MenuItem value={1}>First</MenuItem>
                        <MenuItem value={2}>Second</MenuItem>
                        <MenuItem value={3}>Third</MenuItem>
                        <MenuItem value={4}>Fourth</MenuItem>
                        <MenuItem value={5}>Last</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>Day of Week</InputLabel>
                      <Select
                        value={formData.recurrence_day_of_week || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recurrence_day_of_week: Number(e.target.value),
                          })
                        }
                      >
                        {Object.entries(WeekDay)
                          .filter(([key]) => isNaN(Number(key)))
                          .map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                              {key}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              )}
            </>
          )}

          <Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              End Recurrence
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <DateTimePicker
                  label="End Date"
                  value={formData.recurrence_end_date}
                  onChange={(date) => setFormData({ ...formData, recurrence_end_date: date || undefined })}
                  sx={{ width: '100%' }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Occurrences"
                  value={formData.recurrence_count || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurrence_count: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  inputProps={{ min: 1 }}
                  helperText="Leave empty for no limit"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                error={!!errors.title}
                helperText={errors.title}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <DateTimePicker
                  label="Start Date"
                  value={formData.start_date}
                  onChange={(date) => date && setFormData({ ...formData, start_date: date })}
                  sx={{ width: '100%' }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DateTimePicker
                  label="End Date"
                  value={formData.end_date}
                  onChange={(date) => date && setFormData({ ...formData, end_date: date })}
                  sx={{ width: '100%' }}
                />
              </Box>
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_all_day}
                    onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                  />
                }
                label="All Day Event"
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Recurrence</InputLabel>
                <Select
                  value={formData.recurrence_frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, recurrence_frequency: e.target.value as RecurrenceFrequency })
                  }
                >
                  <MenuItem value={RecurrenceFrequency.NONE}>None</MenuItem>
                  <MenuItem value={RecurrenceFrequency.DAILY}>Daily</MenuItem>
                  <MenuItem value={RecurrenceFrequency.WEEKLY}>Weekly</MenuItem>
                  <MenuItem value={RecurrenceFrequency.MONTHLY}>Monthly</MenuItem>
                  <MenuItem value={RecurrenceFrequency.YEARLY}>Yearly</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {renderRecurrenceOptions()}
          </Box>
        </DialogContent>
        <DialogActions>
          {event && (
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {event ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm; 