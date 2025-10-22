import React, { useState } from 'react';
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
} from '@mui/material';
import { TabInfo } from '../types';

interface AddTabContentDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (tabId: string, contentType: string, content: string) => void;
  availableTabs: TabInfo[];
}

const AddTabContentDialog: React.FC<AddTabContentDialogProps> = ({ 
  open, 
  onClose, 
  onAdd, 
  availableTabs 
}) => {
  const [selectedTab, setSelectedTab] = useState('');
  const [contentType, setContentType] = useState('text');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (selectedTab && content.trim()) {
      onAdd(selectedTab, contentType, content);
      setSelectedTab('');
      setContentType('text');
      setContent('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTab('');
    setContentType('text');
    setContent('');
    onClose();
  };

  React.useEffect(() => {
    if (availableTabs.length > 0 && !selectedTab) {
      setSelectedTab(availableTabs[0].id);
    }
  }, [availableTabs, selectedTab]);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: '#252526',
          color: '#cccccc',
          minWidth: 500,
          borderRadius: '6px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #3e3e42', color: '#ffffff', fontWeight: 500, fontSize: '15px', pb: 2 }}>
        Add Tab Content
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#cccccc' }}>Tab</InputLabel>
            <Select
              value={selectedTab}
              label="Tab"
              onChange={(e) => setSelectedTab(e.target.value)}
              sx={{
                color: '#cccccc',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3e3e42' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007acc' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007acc' },
                '& .MuiSvgIcon-root': { color: '#cccccc' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#252526',
                    color: '#cccccc',
                    '& .MuiMenuItem-root': {
                      '&:hover': { backgroundColor: '#2a2d2e' },
                      '&.Mui-selected': { backgroundColor: '#37373d' },
                    },
                  },
                },
              }}
            >
              {availableTabs.map((tab) => (
                <MenuItem key={tab.id} value={tab.id}>
                  {tab.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={{ color: '#cccccc' }}>Content Type</InputLabel>
            <Select
              value={contentType}
              label="Content Type"
              onChange={(e) => setContentType(e.target.value)}
              sx={{
                color: '#cccccc',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3e3e42' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007acc' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007acc' },
                '& .MuiSvgIcon-root': { color: '#cccccc' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#252526',
                    color: '#cccccc',
                    '& .MuiMenuItem-root': {
                      '&:hover': { backgroundColor: '#2a2d2e' },
                      '&.Mui-selected': { backgroundColor: '#37373d' },
                    },
                  },
                },
              }}
            >
              <MenuItem value="text">Plain Text</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
              <MenuItem value="log">Log</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="tree">Tree Structure</MenuItem>
              <MenuItem value="list">List</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Content"
            fullWidth
            multiline
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content..."
            sx={{
              '& .MuiInputLabel-root': { color: '#cccccc' },
              '& .MuiOutlinedInput-root': {
                color: '#cccccc',
                fontFamily: contentType === 'text' || contentType === 'log' || contentType === 'json' ? 'monospace' : 'inherit',
                fontSize: '13px',
                '& fieldset': { borderColor: '#3e3e42' },
                '&:hover fieldset': { borderColor: '#007acc' },
                '&.Mui-focused fieldset': { borderColor: '#007acc' },
              },
            }}
          />
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
          onClick={handleAdd}
          variant="contained"
          disabled={!selectedTab || !content.trim()}
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
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTabContentDialog;
