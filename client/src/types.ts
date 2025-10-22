// Type definitions for VS Code Clone

export interface TreeItem {
  id: string;
  label: string;
  type: string;
  content?: string;
  language?: string;
  children?: TreeItem[];
  tabContents?: Record<string, TabContent>;
}

export interface TabContent {
  type: 'text' | 'markdown' | 'log' | 'html' | 'tree' | 'json' | 'table' | 'list';
  content: string | TableContent;
}

export interface TableContent {
  columns: string[];
  rows: any[][];
  rowCount?: number;
  executionTime?: string;
}

export interface TabInfo {
  id: string;
  label: string;
  icon: string;
}

export interface TabConfig {
  tabs: TabInfo[];
}

export interface Config {
  tabConfig: Record<string, TabConfig>;
  defaultTab: string;
}

export interface ContentData {
  items: TreeItem[];
}
