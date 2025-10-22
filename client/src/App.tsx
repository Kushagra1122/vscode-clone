import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, IconButton, Tooltip, Typography, Drawer, useMediaQuery, useTheme } from '@mui/material';
import * as Icons from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import TreeViewNav from './components/TreeViewNav';
import MonacoEditorPanel from './components/MonacoEditorPanel';
import TabbedPanel from './components/TabbedPanel';
import AddNodeDialog from './components/AddNodeDialog';
import AddTabContentDialog from './components/AddTabContentDialog';
import ScheduleFormDialog, { ScheduleFormData } from './components/ScheduleFormDialog';
import { TreeItem, Config, ContentData, TabInfo, TabContent } from './types';
import contentData from './data/content.json';
import configData from './data/config.json';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1e1e1e',
      paper: '#252526',
    },
    text: {
      primary: '#cccccc',
    },
  },
});

function App() {
  const [items, setItems] = useState<TreeItem[]>((contentData as ContentData).items);
  const [selectedNode, setSelectedNode] = useState<TreeItem | null>(null);
  const [currentTabs, setCurrentTabs] = useState<TabInfo[]>([]);
  const [currentTabContents, setCurrentTabContents] = useState<Record<string, TabContent>>({});
  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [addNodeParentId, setAddNodeParentId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const config = configData as Config;

  const handleNodeSelect = (node: TreeItem) => {
    setSelectedNode(node);
    
    const tabConfig = config.tabConfig[node.type];
    if (tabConfig) {
      setCurrentTabs(tabConfig.tabs);
      setCurrentTabContents(node.tabContents || {});
    } else {
      setCurrentTabs([]);
      setCurrentTabContents({});
    }
    
    // Close sidebar on mobile after selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleAddNodeClick = (parentId?: string) => {
    setAddNodeParentId(parentId);
    setAddNodeDialogOpen(true);
  };

  const handleAddNode = (name: string, type: string, content?: string) => {
    const newNode: TreeItem = {
      id: `node-${Date.now()}`,
      label: name,
      type,
      content: content || '',
      language: getLanguageFromType(type),
      children: type === 'folder' ? [] : undefined,
      tabContents: type === 'folder' ? {
        summary: {
          type: 'text',
          content: `**Folder: ${name}**\n\nNew folder created.\n\nFiles: 0\nSubfolders: 0`,
        }
      } : createDefaultTabContents(type, name, content || ''),
    };

    const addNodeToTree = (nodes: TreeItem[], parentId?: string): TreeItem[] => {
      if (!parentId) {
        return [...nodes, newNode];
      }

      return nodes.map(node => {
        if (node.id === parentId && node.type === 'folder') {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addNodeToTree(node.children, parentId),
          };
        }
        return node;
      });
    };

    setItems(addNodeToTree(items, addNodeParentId));
  };

  const handleAddTabContent = (tabId: string, contentType: string, content: string) => {
    if (selectedNode) {
      const newTabContent: TabContent = {
        type: contentType as any,
        content,
      };

      const updatedTabContents = {
        ...currentTabContents,
        [tabId]: newTabContent,
      };

      setCurrentTabContents(updatedTabContents);

      const updateNodeInTree = (nodes: TreeItem[]): TreeItem[] => {
        return nodes.map(node => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              tabContents: updatedTabContents,
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateNodeInTree(node.children),
            };
          }
          return node;
        });
      };

      setItems(updateNodeInTree(items));
    }
  };

  const handleScheduleSubmit = (formData: ScheduleFormData) => {
    console.log('Schedule created:', formData);
    // You can add logic here to save the schedule data
    // For example, add it to a state array or send it to a backend
  };

  const getLanguageFromType = (type: string): string => {
    const languageMap: Record<string, string> = {
      py: 'python',
      sql: 'sql',
      json: 'json',
      md: 'markdown',
      js: 'javascript',
      ts: 'typescript',
      html: 'html',
      css: 'css',
      txt: 'plaintext',
    };
    return languageMap[type] || 'plaintext';
  };

  const createDefaultTabContents = (type: string, name: string, content: string): Record<string, TabContent> => {
    const tabConfig = config.tabConfig[type];
    if (!tabConfig) return {};

    const tabContents: Record<string, TabContent> = {};
    tabConfig.tabs.forEach(tab => {
      if (tab.id === 'preview') {
        tabContents[tab.id] = {
          type: 'text',
          content: `**File: ${name}**\n\nNew ${type} file created.`,
        };
      } else {
        tabContents[tab.id] = {
          type: 'text',
          content: `${tab.label} content for ${name}`,
        };
      }
    });

    return tabContents;
  };

  const sidebarContent = (
    <TreeViewNav 
      items={items} 
      onNodeSelect={handleNodeSelect}
      onAddNode={handleAddNodeClick}
      onScheduleClick={() => setScheduleDialogOpen(true)}
    />
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#1e1e1e', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Activity Bar - Hidden on mobile */}
          {!isMobile && (
            <Box
              sx={{
                width: '48px',
                backgroundColor: '#333333',
                borderRight: '1px solid #2d2d30',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 1,
              }}
            >
              <Tooltip title="Explorer" placement="right">
                <IconButton
                  sx={{
                    color: '#ffffff',
                    borderLeft: '2px solid #007acc',
                    borderRadius: 0,
                    width: '100%',
                    py: 1.5,
                    '&:hover': { backgroundColor: '#37373d' },
                  }}
                >
                  <Icons.FolderOpen />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Sidebar - Desktop/Tablet */}
          {!isMobile && (
            <Box 
              sx={{ 
                width: isTablet ? '250px' : 'calc(20% - 48px)', 
                minWidth: '200px',
                height: '100%', 
                overflow: 'hidden' 
              }}
            >
              {sidebarContent}
            </Box>
          )}

          {/* Sidebar - Mobile Drawer */}
          <Drawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            sx={{
              display: isMobile ? 'block' : 'none',
              '& .MuiDrawer-paper': {
                width: '80%',
                maxWidth: '300px',
                backgroundColor: '#252526',
                borderRight: '1px solid #3e3e42',
              },
            }}
          >
            {sidebarContent}
          </Drawer>

          {/* Main Content Area */}
          <Box 
            sx={{ 
              flex: 1,
              width: isMobile ? '100%' : isTablet ? 'calc(100% - 250px)' : '80%',
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            {/* Mobile Header with Menu Button */}
            {isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1,
                  py: 0.5,
                  backgroundColor: '#252526',
                  borderBottom: '1px solid #2d2d30',
                  gap: 1,
                }}
              >
                <IconButton
                  onClick={() => setSidebarOpen(true)}
                  sx={{
                    color: '#cccccc',
                    '&:hover': { backgroundColor: '#37373d' },
                  }}
                >
                  <MenuIcon />
                </IconButton>
                {selectedNode && (
                  <Typography sx={{ fontSize: '13px', color: '#cccccc', fontWeight: 500 }}>
                    {selectedNode.label}
                  </Typography>
                )}
              </Box>
            )}

            {/* Editor Area */}
            <Box 
              sx={{ 
                height: isTablet ? '70%' : '80%', 
                overflow: 'hidden' 
              }}
            >
              {selectedNode && selectedNode.type !== 'folder' ? (
                <MonacoEditorPanel
                  content={selectedNode.content || ''}
                  language={selectedNode.language || 'plaintext'}
                  filename={selectedNode.label}
                  onContentChange={(newContent) => {
                    const updateContent = (nodes: TreeItem[]): TreeItem[] => {
                      return nodes.map(node => {
                        if (node.id === selectedNode.id) {
                          return { ...node, content: newContent };
                        }
                        if (node.children) {
                          return { ...node, children: updateContent(node.children) };
                        }
                        return node;
                      });
                    };
                    setItems(updateContent(items));
                    setSelectedNode({ ...selectedNode, content: newContent });
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1e1e1e',
                    color: '#858585',
                    fontSize: '16px',
                    fontWeight: 300,
                  }}
                >
                  {selectedNode?.type === 'folder' 
                    ? (
                      <Box sx={{ textAlign: 'center' }}>
                        <Icons.Folder sx={{ fontSize: 64, color: '#dcb67a', mb: 2 }} />
                        <Typography sx={{ color: '#cccccc', fontSize: '16px' }}>
                          {selectedNode.label}
                        </Typography>
                        <Typography sx={{ color: '#858585', fontSize: '13px', mt: 0.5 }}>
                          Folder
                        </Typography>
                      </Box>
                    )
                    : 'Select a file to view'}
                </Box>
              )}
            </Box>

            {/* Tabbed Panel - Responsive Height */}
            <Box 
              sx={{ 
                height: isTablet ? '30%' : '20%',
                minHeight: isMobile ? '150px' : '200px',
                overflow: 'hidden' 
              }}
            >
              {currentTabs.length > 0 ? (
                <TabbedPanel
                  tabs={currentTabs}
                  tabContents={currentTabContents}
                  defaultTab={currentTabs[0]?.id}
                  onAddContent={() => setAddContentDialogOpen(true)}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1e1e1e',
                    borderTop: '1px solid #2d2d30',
                    color: '#858585',
                    fontSize: '13px',
                  }}
                >
                  No tabs available for this item
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Status Bar - Responsive */}
        <Box
          sx={{
            height: '22px',
            backgroundColor: '#007acc',
            borderTop: '1px solid #005a9e',
            display: 'flex',
            alignItems: 'center',
            px: isMobile ? 1 : 1.5,
            fontSize: isMobile ? '10px' : '12px',
            color: '#ffffff',
            gap: isMobile ? 1 : 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Icons.CheckCircle sx={{ fontSize: isMobile ? 12 : 14 }} />
            {!isMobile && <span>VS Code Clone</span>}
          </Box>
          {selectedNode && (
            <>
              <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: '14px' }} />
              <span style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }}>
                {selectedNode.language || 'plaintext'}
              </span>
              {!isMobile && selectedNode.label && (
                <>
                  <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: '14px' }} />
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {selectedNode.label}
                  </span>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      <AddNodeDialog
        open={addNodeDialogOpen}
        onClose={() => setAddNodeDialogOpen(false)}
        onAdd={handleAddNode}
      />

      <AddTabContentDialog
        open={addContentDialogOpen}
        onClose={() => setAddContentDialogOpen(false)}
        onAdd={handleAddTabContent}
        availableTabs={currentTabs}
      />

      <ScheduleFormDialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        onSubmit={handleScheduleSubmit}
      />
    </ThemeProvider>
  );
}

export default App;

