import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import { eventApi } from '@/services/api';
import { Event, EventFormData } from '@/types/event';
import EventLister from '@/components/EventLister';
import EventForm from '@/components/EventForm';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openEventForm, setOpenEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Calculate the start and end dates for a 3-month window centered on the current month
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
      
      console.log('Fetching events from:', startDate.toISOString(), 'to:', endDate.toISOString());
      
      const response = await eventApi.getEvents(startDate, endDate);
      
      // Convert date strings to Date objects
      const formattedEvents = response.map(event => ({
        ...event,
        start_date: new Date(event.start_date),
        end_date: new Date(event.end_date),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setOpenEventForm(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setOpenEventForm(true);
  };

  const handleSaveEvent = async (eventData: EventFormData) => {
    try {
      if (selectedEvent) {
        await eventApi.updateEvent({ ...selectedEvent, ...eventData });
      } else {
        await eventApi.createEvent(eventData);
      }
      setOpenEventForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventApi.deleteEvent(eventId);
      setOpenEventForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, height: '100%', minHeight: 500, borderRadius: 3, boxShadow: 2, overflow: 'hidden', background: '#fff', mt: 0 }}>
            <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2, pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 0, mt: 0 }}>
                  Calendar
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateEvent}>
                  New Event
                </Button>
              </Box>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start_date"
                endAccessor="end_date"
                style={{ height: 450, background: '#fff' }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={({ start }) => setSelectedDate(start)}
                selectable
                views={['month', 'week', 'day', 'agenda']}
                defaultView="month"
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.color || '#1976d2',
                  },
                })}
                onRangeChange={(range: any) => {
                  if (Array.isArray(range) && range.length > 0) {
                    setCurrentDate(startOfMonth(range[0]));
                  } else if (range?.start) {
                    setCurrentDate(startOfMonth(range.start));
                  }
                }}
                onNavigate={date => setCurrentDate(startOfMonth(date))}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <EventLister
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            currentMonth={currentDate}
          />
        </Grid>
      </Grid>
      <EventForm
        open={openEventForm}
        event={selectedEvent}
        onClose={() => setOpenEventForm(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
} 