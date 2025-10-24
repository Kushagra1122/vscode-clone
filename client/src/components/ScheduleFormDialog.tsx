import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';

interface ScheduleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ScheduleFormData) => void;
}

export interface ScheduleFormData {
  name: string;
  cron: string;
  nextRun: string;
  startDate: string;
  endDate: string;
}

const ScheduleFormDialog: React.FC<ScheduleFormDialogProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    name: '',
    cron: '',
    nextRun: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (field: keyof ScheduleFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (formData.name.trim() && formData.cron.trim()) {
      try {
        // Send to FastAPI backend
        const response = await fetch('http://localhost:8000/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            cron: formData.cron,
            next_run: formData.nextRun || new Date().toISOString(),
            start_date: formData.startDate || new Date().toISOString().split('T')[0],
            end_date: formData.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create schedule');
        }

        const createdSchedule = await response.json();
        console.log('Schedule created:', createdSchedule);

        // Also call parent onSubmit for local state update
        onSubmit(formData);

        // Reset form
        setFormData({
          name: '',
          cron: '',
          nextRun: '',
          startDate: '',
          endDate: '',
        });
        onClose();
      } catch (error) {
        console.error('Error creating schedule:', error);
        alert('Failed to create schedule. Please try again.');
      }
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      name: '',
      cron: '',
      nextRun: '',
      startDate: '',
      endDate: '',
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: '#252526',
          color: '#cccccc',
          minWidth: { xs: '90%', sm: 500 },
          maxWidth: 600,
          borderRadius: '6px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #3e3e42', 
        color: '#ffffff', 
        fontWeight: 500, 
        fontSize: '15px', 
        pb: 2 
      }}>
        Create Schedule
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            autoFocus
            label="Name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="Enter schedule name"
            sx={{
              '& .MuiInputLabel-root': { color: '#cccccc', fontSize: '14px' },
              '& .MuiInputLabel-asterisk': { color: '#f48771' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#1e1e1e',
                '& fieldset': { borderColor: '#3e3e42' },
                '&:hover fieldset': { borderColor: '#007acc' },
                '&.Mui-focused fieldset': { borderColor: '#007acc', borderWidth: '2px' },
              },
            }}
          />

          <TextField
            label="Cron Expression"
            fullWidth
            required
            value={formData.cron}
            onChange={handleChange('cron')}
            placeholder="e.g., 0 0 * * *"
            helperText="Enter cron expression for scheduling"
            sx={{
              '& .MuiInputLabel-root': { color: '#cccccc', fontSize: '14px' },
              '& .MuiInputLabel-asterisk': { color: '#f48771' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#1e1e1e',
                fontFamily: 'monospace',
                '& fieldset': { borderColor: '#3e3e42' },
                '&:hover fieldset': { borderColor: '#007acc' },
                '&.Mui-focused fieldset': { borderColor: '#007acc', borderWidth: '2px' },
              },
              '& .MuiFormHelperText-root': {
                color: '#858585',
                fontSize: '12px',
                marginLeft: 0,
              },
            }}
          />

          <TextField
            label="Next Run"
            type="datetime-local"
            fullWidth
            value={formData.nextRun}
            onChange={handleChange('nextRun')}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiInputLabel-root': { color: '#cccccc', fontSize: '14px' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#1e1e1e',
                '& fieldset': { borderColor: '#3e3e42' },
                '&:hover fieldset': { borderColor: '#007acc' },
                '&.Mui-focused fieldset': { borderColor: '#007acc', borderWidth: '2px' },
              },
              '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)',
                cursor: 'pointer',
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={formData.startDate}
              onChange={handleChange('startDate')}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiInputLabel-root': { color: '#cccccc', fontSize: '14px' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  backgroundColor: '#1e1e1e',
                  '& fieldset': { borderColor: '#3e3e42' },
                  '&:hover fieldset': { borderColor: '#007acc' },
                  '&.Mui-focused fieldset': { borderColor: '#007acc', borderWidth: '2px' },
                },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                  cursor: 'pointer',
                },
              }}
            />

            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={formData.endDate}
              onChange={handleChange('endDate')}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiInputLabel-root': { color: '#cccccc', fontSize: '14px' },
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  backgroundColor: '#1e1e1e',
                  '& fieldset': { borderColor: '#3e3e42' },
                  '&:hover fieldset': { borderColor: '#007acc' },
                  '&.Mui-focused fieldset': { borderColor: '#007acc', borderWidth: '2px' },
                },
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                  cursor: 'pointer',
                },
              }}
            />
          </Box>

          {/* Information box */}
          <Box 
            sx={{ 
              backgroundColor: '#1e1e1e', 
              border: '1px solid #3e3e42',
              borderRadius: '4px',
              p: 2,
              mt: 1,
            }}
          >
            <Typography sx={{ fontSize: '12px', color: '#858585', mb: 1 }}>
              <strong style={{ color: '#cccccc' }}>Cron Expression Format:</strong>
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#858585', fontFamily: 'monospace' }}>
              * * * * *<br />
              │ │ │ │ │<br />
              │ │ │ │ └─ Day of week (0-7)<br />
              │ │ │ └─── Month (1-12)<br />
              │ │ └───── Day of month (1-31)<br />
              │ └─────── Hour (0-23)<br />
              └───────── Minute (0-59)
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #3e3e42', px: 3, py: 2.5, gap: 1 }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: '#cccccc',
            textTransform: 'none',
            fontSize: '13px',
            padding: '6px 16px',
            '&:hover': { backgroundColor: '#37373d' },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name.trim() || !formData.cron.trim()}
          sx={{ 
            backgroundColor: '#007acc',
            textTransform: 'none',
            fontSize: '13px',
            padding: '6px 20px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#005a9e', boxShadow: '0 2px 8px rgba(0, 122, 204, 0.3)' },
            '&:disabled': { backgroundColor: '#3e3e42', color: '#666' },
          }}
        >
          Create Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleFormDialog;
