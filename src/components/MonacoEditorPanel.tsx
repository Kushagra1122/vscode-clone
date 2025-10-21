import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography, useTheme, useMediaQuery } from '@mui/material';
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
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
          px: isMobile ? 1 : 1.5,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: isMobile ? '32px' : '36px',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#1e1e1e',
            px: isMobile ? 1 : 2,
            py: isMobile ? 0.5 : 0.75,
            fontSize: isMobile ? '12px' : '13px',
            color: '#ffffff',
            borderTopLeftRadius: '3px',
            borderTopRightRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 0.5 : 1,
            border: '1px solid transparent',
            borderBottom: 'none',
            maxWidth: isMobile ? '60%' : '70%',
          }}
        >
          {hasChanges && (
            <Box
              component="span"
              sx={{
                width: isMobile ? '5px' : '6px',
                height: isMobile ? '5px' : '6px',
                borderRadius: '50%',
                backgroundColor: '#007acc',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          )}
          <Typography 
            sx={{ 
              fontSize: isMobile ? '12px' : '13px', 
              fontWeight: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {filename || 'Untitled'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: isMobile ? 0.25 : 0.5, alignItems: 'center' }}>
          <Tooltip title={isReadOnly ? 'Enable Editing' : 'Lock (Read-only)'} arrow>
            <IconButton
              size="small"
              onClick={toggleReadOnly}
              sx={{
                color: isReadOnly ? '#858585' : '#007acc',
                padding: isMobile ? '4px' : '6px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#37373d',
                  color: isReadOnly ? '#cccccc' : '#0098ff',
                },
              }}
            >
              {isReadOnly ? <LockIcon sx={{ fontSize: isMobile ? 14 : 16 }} /> : <EditIcon sx={{ fontSize: isMobile ? 14 : 16 }} />}
            </IconButton>
          </Tooltip>
          
          {!isReadOnly && hasChanges && (
            <Tooltip title={isMobile ? 'Save' : 'Save Changes (Ctrl+S)'} arrow>
              <IconButton
                size="small"
                onClick={handleSave}
                sx={{
                  color: '#007acc',
                  padding: isMobile ? '4px' : '6px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#37373d',
                    color: '#0098ff',
                  },
                }}
              >
                <SaveIcon sx={{ fontSize: isMobile ? 14 : 16 }} />
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
            minimap: { enabled: !isMobile && !isTablet },
            fontSize: isMobile ? 12 : isTablet ? 13 : 14,
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
            fontLigatures: !isMobile,
            folding: !isMobile,
            lineDecorationsWidth: isMobile ? 5 : 10,
            lineNumbersMinChars: isMobile ? 3 : 5,
            glyphMargin: !isMobile,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: isMobile ? 8 : 10,
              horizontalScrollbarSize: isMobile ? 8 : 10,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MonacoEditorPanel;
