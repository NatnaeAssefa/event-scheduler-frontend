import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import EventForm from '@/components/EventForm';
import { EventFormData } from '@/types/event';
import { eventApi } from '@/services/api';

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // State for EventForm dialog
  const [openEventForm, setOpenEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    if (path === '/events/new') {
      setSelectedEvent(null);
      setOpenEventForm(true);
    } else {
      navigate(path);
    }
    setMobileOpen(false);
  };

  const handleSaveEvent = async (eventData: EventFormData) => {
    try {
      await eventApi.createEvent(eventData);
      setOpenEventForm(false);
      navigate('/calendar', { replace: true });
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleCloseEventForm = () => {
    setOpenEventForm(false);
    if (window.location.pathname !== '/calendar') {
      navigate('/calendar');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <div style={{ height: '100%', background: '#f5f7fa' }}>
      <Toolbar />
      <List sx={{ mt: 2 }}>
        <ListItem button onClick={() => handleNavigation('/calendar')} sx={{ borderRadius: 2, mb: 1, '&:hover': { background: '#e3eafc' } }}>
          <ListItemIcon sx={{ color: '#1976d2', minWidth: 40 }}>
            <CalendarIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500, fontSize: 18 }} primary="Calendar" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/events/new')} sx={{ borderRadius: 2, mb: 1, '&:hover': { background: '#e3eafc' } }}>
          <ListItemIcon sx={{ color: '#1976d2', minWidth: 40 }}>
            <EventIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500, fontSize: 18 }} primary="New Event" />
        </ListItem>
        <ListItem button onClick={handleLogout} sx={{ borderRadius: 2, mt: 4, '&:hover': { background: '#ffeaea' } }}>
          <ListItemIcon sx={{ color: '#dc004e', minWidth: 40 }}>
            <LogoutIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500, fontSize: 18 }} primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', background: '#f0f2f5', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: '#1976d2',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Event Scheduler
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: '#f5f7fa',
              boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: '#f5f7fa',
              boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: '#f0f2f5',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}>
          <Box sx={{
            background: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            p: { xs: 1, sm: 3 },
            mt: 1,
            minHeight: 'calc(100vh - 120px)',
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <EventForm
        open={openEventForm}
        event={selectedEvent}
        onClose={handleCloseEventForm}
        onSave={handleSaveEvent}
        onDelete={() => {}}
      />
    </Box>
  );
} 