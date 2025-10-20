import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';

interface MonacoEditorPanelProps {
  content: string;
  language: string;
  filename: string;
  onContentChange?: (newContent: string) => void;
}

const MonacoEditorPanel: React.FC<MonacoEditorPanelProps> = ({ 
  content, 
  language, 
  filename,
  onContentChange 
}) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [currentContent, setCurrentContent] = useState(content);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentContent(value);
      setHasChanges(value !== content);
    }
  };

  const handleSave = () => {
    if (onContentChange) {
      onContentChange(currentContent);
    }
    setHasChanges(false);
  };

  const toggleReadOnly = () => {
    setIsReadOnly(!isReadOnly);
  };

  // Update content when prop changes
  React.useEffect(() => {
    setCurrentContent(content);
    setHasChanges(false);
    setIsReadOnly(true);
  }, [content]);

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#1e1e1e',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#252526',
          borderBottom: '1px solid #2d2d30',
          px: 1.5,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '36px',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#1e1e1e',
            px: 2,
            py: 0.75,
            fontSize: '13px',
            color: '#ffffff',
            borderTopLeftRadius: '3px',
            borderTopRightRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1px solid transparent',
            borderBottom: 'none',
          }}
        >
          {hasChanges && (
            <Box
              component="span"
              sx={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#007acc',
                display: 'inline-block',
              }}
            />
          )}
          <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>
            {filename || 'Untitled'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Tooltip title={isReadOnly ? 'Enable Editing' : 'Lock (Read-only)'} arrow>
            <IconButton
              size="small"
              onClick={toggleReadOnly}
              sx={{
                color: isReadOnly ? '#858585' : '#007acc',
                padding: '6px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#37373d',
                  color: isReadOnly ? '#cccccc' : '#0098ff',
                },
              }}
            >
              {isReadOnly ? <LockIcon sx={{ fontSize: 16 }} /> : <EditIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
          
          {!isReadOnly && hasChanges && (
            <Tooltip title="Save Changes (Ctrl+S)" arrow>
              <IconButton
                size="small"
                onClick={handleSave}
                sx={{
                  color: '#007acc',
                  padding: '6px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#37373d',
                    color: '#0098ff',
                  },
                }}
              >
                <SaveIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Editor
          height="100%"
          language={language}
          value={currentContent}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            readOnly: isReadOnly,
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            cursorStyle: isReadOnly ? 'line-thin' : 'line',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
            fontLigatures: true,
          }}
        />
      </Box>
    </Box>
  );
};

export default MonacoEditorPanel;
