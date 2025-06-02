import { useMemo } from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Event } from '@/types/event';
import { format, isSameDay, isSameMonth } from 'date-fns';

interface EventListerProps {
  events: Event[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  currentMonth: Date;
}

export default function EventLister({ events, selectedDate, onSelectDate, currentMonth }: EventListerProps) {
  // Filter events for the current month
  const monthEvents = useMemo(() =>
    events.filter(event => isSameMonth(event.start_date, currentMonth)),
    [events, currentMonth]
  );

  // If a day is selected, filter events for that day
  const dayEvents = useMemo(() =>
    selectedDate ? monthEvents.filter(event => isSameDay(event.start_date, selectedDate)) : [],
    [monthEvents, selectedDate]
  );

  // Group events by day for the month view
  const eventsByDay = useMemo(() => {
    const map: { [date: string]: Event[] } = {};
    monthEvents.forEach(event => {
      const dayKey = format(event.start_date, 'yyyy-MM-dd');
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push(event);
    });
    return map;
  }, [monthEvents]);

  return (
    <Box sx={{ mt: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {selectedDate ? `Events on ${format(selectedDate, 'PPP')}` : `Events in ${format(currentMonth, 'MMMM yyyy')}`}
          </Typography>
          {selectedDate ? (
            <>
              <Button size="small" onClick={() => onSelectDate(null)} sx={{ mb: 2 }}>
                Back to month
              </Button>
              <List>
                {dayEvents.length === 0 && <ListItem><ListItemText primary="No events." /></ListItem>}
                {dayEvents.map(event => (
                  <ListItem key={event.id} sx={{ borderLeft: `4px solid ${event.color || '#1976d2'}` }}>
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          {format(event.start_date, 'p')} - {format(event.end_date, 'p')}
                          {event.location && ` | ${event.location}`}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <List>
              {Object.keys(eventsByDay).length === 0 && <ListItem><ListItemText primary="No events this month." /></ListItem>}
              {Object.entries(eventsByDay).map(([date, events]) => (
                <Box key={date}>
                  <ListItem button onClick={() => onSelectDate(new Date(date))} sx={{ background: '#f5f7fa', borderRadius: 1, mb: 1 }}>
                    <ListItemText
                      primary={format(new Date(date), 'PPP')}
                      secondary={`${events.length} event${events.length > 1 ? 's' : ''}`}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 