import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, IconButton, Tooltip, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';
import TreeViewNav from './components/TreeViewNav';
import MonacoEditorPanel from './components/MonacoEditorPanel';
import TabbedPanel from './components/TabbedPanel';
import AddNodeDialog from './components/AddNodeDialog';
import AddTabContentDialog from './components/AddTabContentDialog';
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
  const [addNodeParentId, setAddNodeParentId] = useState<string | undefined>();

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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#1e1e1e', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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

          <Box sx={{ width: 'calc(20% - 48px)', height: '100%', overflow: 'hidden' }}>
            <TreeViewNav 
              items={items} 
              onNodeSelect={handleNodeSelect}
              onAddNode={handleAddNodeClick}
            />
          </Box>

          <Box sx={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '80%', overflow: 'hidden' }}>
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

            <Box sx={{ height: '20%', overflow: 'hidden' }}>
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

        <Box
          sx={{
            height: '22px',
            backgroundColor: '#007acc',
            borderTop: '1px solid #005a9e',
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            fontSize: '12px',
            color: '#ffffff',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Icons.CheckCircle sx={{ fontSize: 14 }} />
            <span>VS Code Clone</span>
          </Box>
          {selectedNode && (
            <>
              <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: '14px' }} />
              <span>{selectedNode.language || 'plaintext'}</span>
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
    </ThemeProvider>
  );
}

export default App;

