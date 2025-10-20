import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import * as Icons from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { TabContent, TabInfo, TableContent } from '../types';

interface TabbedPanelProps {
  tabs: TabInfo[];
  tabContents: Record<string, TabContent>;
  defaultTab?: string;
  onAddContent?: () => void;
}

const TabbedPanel: React.FC<TabbedPanelProps> = ({ tabs, tabContents, defaultTab, onAddContent }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  React.useEffect(() => {
    setActiveTab(defaultTab || tabs[0]?.id || '');
  }, [defaultTab, tabs]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const renderIcon = (iconName: string) => {
    // Convert snake_case to PascalCase for MUI icon names
    const pascalCase = iconName.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    const IconComponent = (Icons as any)[pascalCase];
    return IconComponent ? <IconComponent sx={{ fontSize: 18, mr: 0.5 }} /> : null;
  };

  const renderContent = (content: TabContent) => {
    if (!content) return <Typography sx={{ p: 2, color: '#cccccc' }}>No content available</Typography>;

    switch (content.type) {
      case 'text':
      case 'log':
        return (
          <Box sx={{ p: 3, fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#d4d4d4', lineHeight: 1.6 }}>
            {content.content as string}
          </Box>
        );

      case 'markdown':
        return (
          <Box sx={{ p: 3, color: '#d4d4d4', lineHeight: 1.7, '& code': { backgroundColor: '#2d2d30', px: 1, py: 0.5, borderRadius: '3px', fontFamily: 'monospace', fontSize: '12px' }, '& strong': { color: '#ffffff' } }}>
            <div dangerouslySetInnerHTML={{ __html: (content.content as string).replace(/\n/g, '<br/>') }} />
          </Box>
        );

      case 'html':
        return (
          <Box sx={{ p: 2, color: '#cccccc' }}>
            <div dangerouslySetInnerHTML={{ __html: content.content as string }} />
          </Box>
        );

      case 'tree':
        return (
          <Box sx={{ p: 2, fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre', color: '#cccccc' }}>
            {content.content as string}
          </Box>
        );

      case 'json':
        return (
          <Box sx={{ p: 2, fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre', color: '#cccccc', backgroundColor: '#1e1e1e' }}>
            {typeof content.content === 'string' ? content.content : JSON.stringify(content.content, null, 2)}
          </Box>
        );

      case 'table':
        const tableData = content.content as TableContent;
        return (
          <Box sx={{ p: 3 }}>
            <TableContainer component={Paper} sx={{ backgroundColor: '#252526', maxHeight: 400, boxShadow: 'none', border: '1px solid #3e3e42' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {tableData.columns?.map((col, idx) => (
                      <TableCell key={idx} sx={{ backgroundColor: '#2d2d30', color: '#ffffff', fontWeight: 600, borderBottom: '2px solid #007acc', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.rows?.map((row, rowIdx) => (
                    <TableRow key={rowIdx} sx={{ '&:hover': { backgroundColor: '#2a2d2e' }, transition: 'background-color 0.15s ease' }}>
                      {row.map((cell, cellIdx) => (
                        <TableCell key={cellIdx} sx={{ color: '#d4d4d4', borderBottom: '1px solid #3e3e42', fontSize: '13px', fontFamily: 'monospace' }}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {tableData.rowCount !== undefined && (
              <Typography sx={{ mt: 2, fontSize: '12px', color: '#858585', fontStyle: 'italic' }}>
                {tableData.rowCount} row{tableData.rowCount !== 1 ? 's' : ''} {tableData.executionTime && `• ${tableData.executionTime}`}
              </Typography>
            )}
          </Box>
        );

      case 'list':
        return (
          <Box sx={{ p: 2, fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#cccccc' }}>
            {content.content as string}
          </Box>
        );

      default:
        return <Typography sx={{ p: 2, color: '#cccccc' }}>{JSON.stringify(content.content)}</Typography>;
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#1e1e1e',
        borderTop: '1px solid #2d2d30',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#252526',
          borderBottom: '1px solid #2d2d30',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 36,
            flex: 1,
            '& .MuiTabs-indicator': {
              backgroundColor: '#007acc',
              height: '2px',
            },
            '& .MuiTab-root': {
              minHeight: 36,
              textTransform: 'none',
              fontSize: '13px',
              color: '#969696',
              fontWeight: 400,
              padding: '6px 12px',
              transition: 'color 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                color: '#cccccc',
                backgroundColor: '#2a2d2e',
              },
              '&.Mui-selected': {
                color: '#ffffff',
                fontWeight: 500,
              },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {renderIcon(tab.icon)}
                  <span>{tab.label}</span>
                </Box>
              }
            />
          ))}
        </Tabs>
        
        {onAddContent && (
          <Tooltip title="Add tab content" arrow>
            <IconButton
              size="small"
              onClick={onAddContent}
              sx={{
                mr: 1,
                padding: '6px',
                transition: 'all 0.2s ease',
                color: '#858585',
                '&:hover': {
                  backgroundColor: '#37373d',
                  color: '#cccccc',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: '10px', height: '10px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#424242', borderRadius: '5px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#1e1e1e' } }}>
        {renderContent(tabContents[activeTab])}
      </Box>
    </Box>
  );
};

export default TabbedPanel;
