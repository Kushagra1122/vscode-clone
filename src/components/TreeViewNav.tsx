import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import * as Icons from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { TreeItem as TreeItemType } from '../types';

interface TreeViewNavProps {
  items: TreeItemType[];
  onNodeSelect: (node: TreeItemType) => void;
  onAddNode?: (parentId?: string) => void;
}

const TreeViewNav: React.FC<TreeViewNavProps> = ({ items, onNodeSelect, onAddNode }) => {
  const getFileIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      py: Icons.Code,
      sql: Icons.Storage,
      json: Icons.DataObject,
      md: Icons.Description,
      folder: Icons.Folder,
      txt: Icons.TextSnippet,
      js: Icons.Code,
      ts: Icons.Code,
      html: Icons.Html,
      css: Icons.Css,
    };

    const colorMap: Record<string, string> = {
      py: '#4B8BBE',
      sql: '#00758F',
      json: '#FFC107',
      md: '#519aba',
      folder: '#dcb67a',
      txt: '#cccccc',
      js: '#F7DF1E',
      ts: '#3178C6',
      html: '#E34C26',
      css: '#563D7C',
    };

    const IconComponent = iconMap[type] || Icons.InsertDriveFile;
    return <IconComponent sx={{ fontSize: 18, mr: 1, color: colorMap[type] || '#519aba' }} />;
  };

  const handleNodeClick = (itemId: string) => {
    const findNode = (nodes: TreeItemType[]): TreeItemType | null => {
      for (const node of nodes) {
        if (node.id === itemId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const node = findNode(items);
    if (node) {
      onNodeSelect(node);
    }
  };

  const renderTree = (nodes: TreeItemType[]) => {
    return nodes.map((node) => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 0.75,
              position: 'relative',
              '&:hover .add-button': {
                opacity: 1,
              },
            }}
          >
            {getFileIcon(node.type)}
            <Typography 
              sx={{ 
                fontSize: '13px', 
                color: '#cccccc', 
                flexGrow: 1,
                fontWeight: node.type === 'folder' ? 500 : 400,
              }}
            >
              {node.label}
            </Typography>
            {node.type === 'folder' && onAddNode && (
              <Tooltip title="Add file/folder" placement="right">
                <IconButton
                  className="add-button"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNode(node.id);
                  }}
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    padding: '3px',
                    marginLeft: 'auto',
                    '&:hover': {
                      backgroundColor: '#37373d',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 15, color: '#cccccc' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
      >
        {node.children && node.children.length > 0 && renderTree(node.children)}
      </TreeItem>
    ));
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#252526',
        borderRight: '1px solid #3e3e42',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #3e3e42',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#252526',
        }}
      >
        <Typography sx={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          color: '#cccccc', 
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Explorer
        </Typography>
        {onAddNode && (
          <Tooltip title="Add file/folder to root">
            <IconButton
              size="small"
              onClick={() => onAddNode()}
              sx={{
                padding: '4px',
                '&:hover': {
                  backgroundColor: '#37373d',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 16, color: '#cccccc' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Tree View */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1, py: 1 }}>
        <SimpleTreeView
          onItemClick={(event, itemId) => handleNodeClick(itemId)}
          sx={{
            '& .MuiTreeItem-content': {
              padding: '3px 6px',
              borderRadius: '4px',
              transition: 'background-color 0.15s ease',
              '&:hover': {
                backgroundColor: '#2a2d2e',
              },
              '&.Mui-selected': {
                backgroundColor: '#37373d !important',
                '&:hover': {
                  backgroundColor: '#3e3e42 !important',
                },
              },
              '&.Mui-focused': {
                backgroundColor: 'transparent',
              },
            },
            '& .MuiTreeItem-iconContainer': {
              width: '18px',
              marginRight: '6px',
              '& svg': {
                fontSize: '16px',
                color: '#cccccc',
              },
            },
            '& .MuiTreeItem-group': {
              marginLeft: '12px',
              paddingLeft: '12px',
              borderLeft: '1px solid #3e3e42',
            },
          }}
        >
          {renderTree(items)}
        </SimpleTreeView>
      </Box>
    </Box>
  );
};

export default TreeViewNav;
