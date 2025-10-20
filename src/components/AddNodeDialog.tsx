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

interface AddNodeDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, type: string, content?: string) => void;
}

const AddNodeDialog: React.FC<AddNodeDialogProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('py');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name, type, content);
      setName('');
      setType('py');
      setContent('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setType('py');
    setContent('');
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
          minWidth: 500,
          borderRadius: '6px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #3e3e42', color: '#ffffff', fontWeight: 500, fontSize: '15px', pb: 2 }}>
        Add New File/Folder
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            autoFocus
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter file or folder name"
            sx={{
              '& .MuiInputLabel-root': { color: '#cccccc', fontSize: '14px' },
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#1e1e1e',
                '& fieldset': { borderColor: '#3e3e42' },
                '&:hover fieldset': { borderColor: '#007acc' },
                '&.Mui-focused fieldset': { borderColor: '#007acc', borderWidth: '2px' },
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: '#cccccc', fontSize: '14px' }}>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value)}
              sx={{
                color: '#ffffff',
                backgroundColor: '#1e1e1e',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3e3e42' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007acc' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007acc', borderWidth: '2px' },
                '& .MuiSvgIcon-root': { color: '#cccccc' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#252526',
                    color: '#cccccc',
                    borderRadius: '4px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                    '& .MuiMenuItem-root': {
                      fontSize: '14px',
                      padding: '10px 16px',
                      '&:hover': { backgroundColor: '#2a2d2e' },
                      '&.Mui-selected': { backgroundColor: '#37373d', '&:hover': { backgroundColor: '#3e3e42' } },
                    },
                  },
                },
              }}
            >
              <MenuItem value="folder">Folder</MenuItem>
              <MenuItem value="py">Python (.py)</MenuItem>
              <MenuItem value="sql">SQL (.sql)</MenuItem>
              <MenuItem value="json">JSON (.json)</MenuItem>
              <MenuItem value="md">Markdown (.md)</MenuItem>
              <MenuItem value="js">JavaScript (.js)</MenuItem>
              <MenuItem value="ts">TypeScript (.ts)</MenuItem>
              <MenuItem value="txt">Text (.txt)</MenuItem>
            </Select>
          </FormControl>

          {type !== 'folder' && (
            <TextField
              label="Content (optional)"
              fullWidth
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter initial content..."
              sx={{
                '& .MuiInputLabel-root': { color: '#cccccc' },
                '& .MuiOutlinedInput-root': {
                  color: '#cccccc',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  '& fieldset': { borderColor: '#3e3e42' },
                  '&:hover fieldset': { borderColor: '#007acc' },
                  '&.Mui-focused fieldset': { borderColor: '#007acc' },
                },
              }}
            />
          )}
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
          disabled={!name.trim()}
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

export default AddNodeDialog;
