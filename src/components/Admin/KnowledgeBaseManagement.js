// src/components/Admin/KnowledgeBaseManagement.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  InputAdornment
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// Icons
//import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
//import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import { blue, grey } from '@mui/material/colors';


// Mock Knowledge Base Structure
const initialKnowledgeBase = [
  {
    id: 'kb-001', name: 'SEWA', type: 'folder', children: [
      {
        id: 'kb-001-001', name: 'Authorization', type: 'folder', children: [
          { id: 'kb-001-001-001', name: 'Auth_Guide.pdf', type: 'file', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'kb-001-001-002', name: 'Role_Matrix.xlsx', type: 'file', content: 'https://www.learningcontainer.com/wp-content/uploads/2020/07/Sample-Spreadsheet-10-rows.xlsx' },
        ]
      },
      {
        id: 'kb-001-002', name: 'Basis', type: 'folder', children: [
          { id: 'kb-001-002-doc1', name: 'Basis_Overview.docx', type: 'file', content: 'https://file-examples.com/storage/fe3280148762747d1748239/2017/10/file-example_PPT_250kB.ppt' },
          {
            id: 'kb-001-002-001', name: 'SEWA Add on or Plugin Update', type: 'folder', children: [
              { id: 'kb-001-002-001-doc1', name: 'Plugin_Update_Steps.pdf', type: 'file', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            ]
          },
          { id: 'kb-001-002-002', name: 'SEWA_SSAM_TCI_NOTES', type: 'folder', children: [] },
        ]
      },
      {
        id: 'kb-001-003', name: 'CRM', type: 'folder', children: [
          {
            id: 'kb-001-003-001', name: 'NCP', type: 'folder', children: [
              { id: 'kb-001-003-001-doc1', name: 'NCP_Troubleshooting.txt', type: 'file', content: 'data:text/plain;charset=utf-8,This is a mock content for NCP_Troubleshooting.txt file.' },
            ]
          },
        ]
      },
      { id: 'kb-001-004', name: 'EAM', type: 'folder', children: [] },
      {
        id: 'kb-001-005', name: 'EWM', type: 'folder', children: [
          { id: 'kb-001-005-001', name: 'BBP', type: 'folder', children: [] },
          { id: 'kb-001-005-002', name: 'SEWA-Documents', type: 'folder', children: [] },
          { id: 'kb-001-005-003', name: 'Storage Bins', type: 'folder', children: [] },
          { id: 'kb-001-005-004', name: 'Test Scripts', type: 'folder', children: [] },
          { id: 'kb-001-005-005', name: 'Training Documents', type: 'folder', children: [] },
        ]
      },
      { id: 'kb-001-006', name: 'FICA', type: 'folder', children: [] },
      {
        id: 'kb-001-007', name: 'HCM', type: 'folder', children: [
          { id: 'kb-001-007-doc1', name: 'HCM_Overview.pdf', type: 'file', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          {
            id: 'kb-001-007-001', name: 'Payroll', type: 'folder', children: [
              { id: 'kb-001-007-001-001', name: 'FDs and TDs', type: 'folder', children: [] },
              { id: 'kb-001-007-001-002', name: 'PCC Manage Process', type: 'folder', children: [] },
              { id: 'kb-001-007-001-003', name: 'PCC Posting Payroll', type: 'folder', children: [] },
              { id: 'kb-001-007-001-004', name: 'PCC Productive Payroll Run', type: 'folder', children: [] },
              { id: 'kb-001-007-001-005', name: 'PCC Test Payroll', type: 'folder', children: [] },
              { id: 'kb-001-007-001-006', name: 'Supporting Documents-KT', type: 'folder', children: [] },
            ]
          },
          { id: 'kb-001-007-002', name: 'Replication', type: 'folder', children: [] },
          {
            id: 'kb-001-007-003', name: 'S4 Time Management', type: 'folder', children: [
              { id: 'kb-001-007-003-001', name: 'Training Simulation materials', type: 'folder', children: [] },
            ]
          },
        ]
      },
      { id: 'kb-001-008', name: 'PPQM', type: 'folder', children: [] },
      { id: 'kb-001-009', name: 'SAM', type: 'folder', children: [] },
      { id: 'kb-001-010', name: 'SD', type: 'folder', children: [] },
      { id: 'kb-001-011', name: 'SuccessFactors', type: 'folder', children: [] },
    ],
  },
];


const KnowledgeBaseManagement = () => {
  const [knowledgeBase, setKnowledgeBase] = useState(initialKnowledgeBase);
  const [selectedNode, setSelectedNode] = useState(null); // The currently selected folder/file
  const [expanded, setExpanded] = useState([]); // Controls expanded folders in TreeView

  // Dialog states for various actions
  const [openAddFolderDialog, setOpenAddFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState(''); // For mock content/URL
  const fileInputRef = useRef(null); // For actual file input

  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [renamingNodeName, setRenamingNodeName] = useState('');
  const [fileToRename, setFileToRename] = useState(null);

  // Recursive function to render TreeItem nodes
  const renderTree = (nodes) =>
    nodes.map((node) => {
      if (node.type !== 'folder') return null;

      return (
        <TreeItem
          key={node.id}
          itemId={node.id}
          label={node.name}
          onClick={(event) => {
            event.stopPropagation();
            setSelectedNode(node)
          }}
          //sx={{
          //bgcolor: selectedNode?.id === node.id ? blue[50] : 'transparent',
          //'&:hover': { bgcolor: blue[100] },
          //borderRadius: 1,
          //mb: 0.5,
          //color: node.type === 'folder' ? 'text.primary' : 'text.secondary.main' // Default text color
          //}}
          slots={{
            icon: node.type === 'folder' ? FolderIcon : InsertDriveFileIcon, // Custom icons
            collapseIcon: FolderOpenIcon, // Icon when folder is open
            expandIcon: FolderIcon,       // Icon when folder is closed
          }}
          slotProps={{
            label: {
              sx: {
                color: node.type === 'folder' ? 'text.primary' : 'text.secondary',
                fontWeight: node.type === 'folder' ? 'bold' : 'normal',
              }
            },
            icon: {
              sx: { color: node.type === 'folder' ? blue[600] : grey[500] }
            },
            // Apply selection styling to the content slot
            content: {
              sx: {
                // Use a slightly darker blue for selected background
                '&.Mui-selected': {
                  bgcolor: blue[200] + ' !important', // Use !important to override TreeView's default
                  color: 'text.primary',
                  borderRadius: '4px', // Keep rounded edges for individual items if desired
                  '&:hover': {
                    bgcolor: blue[300] + ' !important',
                  },
                },
                // Style for hover state for non-selected items
                '&:hover': {
                  bgcolor: blue[50], // A very light blue on hover for any item
                },
                borderRadius: '4px', // Apply a small border radius to the item itself
              },
            },
          }}
        >
          {Array.isArray(node.children) && node.children.length > 0 ? renderTree(node.children) : null}
        </TreeItem>
      )
    });
  // Helper function to find a node by ID and its parent in the tree
  const findNodeAndParent = (nodes, nodeId, parent = null) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return { node, parent, path: [node.id] };
      }
      if (node.children) {
        const found = findNodeAndParent(node.children, nodeId, node);
        if (found) {
          return { ...found, path: [node.id, ...found.path] };
        }
      }
    }
    return null;
  };

  // Helper to update a node in an immutable way
  const updateNodeInTree = (nodes, nodeId, updateFn) => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return updateFn(node);
      }
      if (node.children) {
        return { ...node, children: updateNodeInTree(node.children, nodeId, updateFn) };
      }
      return node;
    });
  };


  // Helper to add a node in an immutable way
  const addNodeToTree = (nodes, parentId, newNode) => {
    return nodes.map(node => {
      if (node.id === parentId && node.type === 'folder') {
        return { ...node, children: [...(node.children || []), newNode] };
      }
      if (node.children) {
        return { ...node, children: addNodeToTree(node.children, parentId, newNode) };
      }
      return node;
    });
  };

  // Helper to delete a node in an immutable way
  const deleteNodeInTree = (nodes, nodeIdToDelete) => {
    return nodes.filter(node => node.id !== nodeIdToDelete).map(node => {
      if (node.children) {
        return { ...node, children: deleteNodeInTree(node.children, nodeIdToDelete) };
      }
      return node;
    });
  };

  // --- Handlers for Actions ---

  const handleAddFolder = () => {
    if (!selectedNode || selectedNode.type !== 'folder') {
      alert('Please select a folder to add a new folder inside it.');
      return;
    }
    setOpenAddFolderDialog(true);
  };

  const confirmAddFolder = () => {
    if (newFolderName.trim() && selectedNode) {
      const newId = `${selectedNode.id}-${newFolderName.replace(/\s/g, '_').toLowerCase()}`; // Basic ID generation
      const newNode = { id: newId, name: newFolderName.trim(), type: 'folder', children: [] };
      setKnowledgeBase(prev => addNodeToTree(prev, selectedNode.id, newNode));
      setNewFolderName('');
      setOpenAddFolderDialog(false);
    }
  };

  const handleAddFile = () => {
    if (!selectedNode || selectedNode.type !== 'folder') {
      alert('Please select a folder to add a new file inside it.');
      return;
    }
    setOpenAddFileDialog(true);
  };

  const confirmAddFile = () => {
    if (newFileName.trim() && selectedNode) {
      // In a real app, you'd handle file upload here (e.g., to S3) and get a URL
      const newId = `${selectedNode.id}-${newFileName.replace(/\s/g, '_').toLowerCase()}`;
      const newNode = { id: newId, name: newFileName.trim(), type: 'file', content: newFileContent || `(Mock content for ${newFileName.trim()})` };
      setKnowledgeBase(prev => addNodeToTree(prev, selectedNode.id, newNode));
      setNewFileName('');
      setNewFileContent('');
      setOpenAddFileDialog(false);
    }
  };

  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    if (file && selectedNode && selectedNode.type === 'folder') {
      setNewFileName(file.name);
      setNewFileContent(`data:${file.type};name=${file.name};base64,...(mock_base64_content)`); // Simulate content
      // You could trigger confirmAddFile here if you want immediate upload
      // For this demo, let's just populate the dialog fields
    }
  };


  const handleRename = () => {
    if (!selectedNode) return;
    setRenamingNodeName(selectedNode.name);
    setOpenRenameDialog(true);
  };

  const confirmRename = () => {
 if (!renamingNodeName.trim()) return;
  if (fileToRename) {
    
    setKnowledgeBase(prev => updateNodeInTree(prev, fileToRename.id, node => ({
      ...node,
      name: renamingNodeName.trim()
    })));
    setSelectedNode(prev => prev && prev.id === fileToRename.id ? { ...prev, name: renamingNodeName.trim() } : prev);
    setFileToRename(null);
  } else if (selectedNode) {
    setKnowledgeBase(prev => updateNodeInTree(prev, selectedNode.id, node => ({
      ...node,
      name: renamingNodeName.trim()
    })));
    setSelectedNode(prev => prev ? { ...prev, name: renamingNodeName.trim() } : null);

  }

  setRenamingNodeName('');
  setOpenRenameDialog(false);
  

  };

  const handleDeleteNode = () => {
    if (!selectedNode || !window.confirm(`Are you sure you want to delete "${selectedNode.name}" and its contents?`)) {
      return;
    }
    setKnowledgeBase(prev => deleteNodeInTree(prev, selectedNode.id));
    setSelectedNode(null);
  };


  // --- Render ---

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Knowledge Base Management
      </Typography>

      <Paper sx={{ p: 2, display: 'flex', minHeight: 400 }}>
        {/* Tree View Section */}
        <Box sx={{ width: '40%', borderRight: '1px solid', borderColor: 'grey.300', pr: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CreateNewFolderIcon />}
              onClick={handleAddFolder}
              disabled={!selectedNode || selectedNode.type !== 'folder'}
            >
              Add Folder
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<UploadFileIcon />}
              onClick={handleAddFile}
              disabled={!selectedNode || selectedNode.type !== 'folder'}
            >
              Add File
            </Button>
          </Stack>

          {knowledgeBase.length === 0 ? (
            <Typography variant="body2" color="text.secondary">Knowledge Base is empty.</Typography>
          ) : (
            <SimpleTreeView
              aria-label="knowledge base navigator"
              selected={selectedNode?.id || ''}
              onSelectedItemsChange={(event, itemId) => {
                if (itemId) { // Ensure an item is actually selected
                  const found = findNodeAndParent(knowledgeBase, itemId);
                  if (found && found.node.type === 'folder') {
                    setSelectedNode(found.node);
                  } else {
                    setSelectedNode(null);
                  }
                }
              }}
              expandedItems={expanded}
              onExpandedItemsChange={(event, itemIds) => setExpanded(itemIds)}
              sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
              {renderTree(knowledgeBase)}
            </SimpleTreeView>
          )}
        </Box>

        {/* Node Details / Actions Section */}
        <Box sx={{ width: '60%', pl: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedNode ? selectedNode.name : 'Select an item'}
          </Typography>

          {/* {selectedNode ? (
            <>
              <Stack direction="row" spacing={1} mb={2}>
                <Button variant="outlined" startIcon={<DriveFileRenameOutlineIcon />} onClick={handleRename}>Rename</Button>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteNode}>Delete</Button>
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Type: {selectedNode.type === 'folder' ? 'Folder' : 'File'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {selectedNode.id}
              </Typography>

              {selectedNode.type === 'file' && (
                <Box mt={2}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>File Actions:</Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        if (selectedNode.content) {
                          window.open(selectedNode.content, '_blank'); // Opens URL or data URI
                        } else {
                          alert('No content URL available for this mock file.');
                        }
                      }}
                      disabled={!selectedNode.content}
                    >
                      Download/View
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace File
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const newContent = `data:${file.type};name=${file.name};base64,...(mock_base64_for_${file.name})`;
                            setKnowledgeBase(prev => updateNodeInTree(prev, selectedNode.id, node => ({ ...node, name: file.name, content: newContent })));
                            setSelectedNode(prev => prev ? { ...prev, name: file.name, content: newContent } : null); // Update selected node immediately
                            alert(`File "${file.name}" simulated as replaced.`);
                        }
                      }}
                    />
                  </Stack>
                  {selectedNode.content && (
                    <Typography variant="caption" color="text.disabled" mt={1} display="block">
                      <LinkIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> {selectedNode.content.substring(0, 50)}...
                    </Typography>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Typography color="text.secondary">No item selected. Use buttons above to manage.</Typography>
          )} */}
          {selectedNode ? (
            selectedNode.type === 'folder' ? (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Files in "{selectedNode.name}"
                </Typography>

                {selectedNode.children && selectedNode.children.filter(c => c.type === 'file').length > 0 ? (
                  <Stack spacing={1}>
                    {selectedNode.children
                      .filter(child => child.type === 'file')
                      .map(file => (
                        <Paper key={file.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography>{file.name}</Typography>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => file.content && window.open(file.content, '_blank')}
                              disabled={!file.content}
                            >
                              View
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteNode(file.id)}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DriveFileRenameOutlineIcon />}
                              onClick={() => {
                                setFileToRename(file);
                                setRenamingNodeName(file.name);
                                setOpenRenameDialog(true);
                              }}
                            >
                              Rename
                            </Button>

                          </Stack>
                        </Paper>
                      ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">No files in this folder.</Typography>
                )}
              </>
            ) : (
              // When selected node is a file
              <>
                <Typography variant="h6">{selectedNode.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Type: File
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => selectedNode.content && window.open(selectedNode.content, '_blank')}
                  disabled={!selectedNode.content}
                >
                  Download/View
                </Button>
              </>
            )
          ) : (
            <Typography color="text.secondary">Select a folder to see its files.</Typography>
          )}

        </Box>
      </Paper>


      {/* Add Folder Dialog */}
      <Dialog open={openAddFolderDialog} onClose={() => setOpenAddFolderDialog(false)}>
        <DialogTitle>Add New Folder in "{selectedNode?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFolderDialog(false)}>Cancel</Button>
          <Button onClick={confirmAddFolder} variant="contained" disabled={!newFolderName.trim()}>Add Folder</Button>
        </DialogActions>
      </Dialog>

      {/* Add File Dialog */}
      <Dialog open={openAddFileDialog} onClose={() => setOpenAddFileDialog(false)}>
        <DialogTitle>Add New File in "{selectedNode?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="File Content (URL or text)"
            type="text"
            fullWidth
            variant="outlined"
            value={newFileContent}
            onChange={(e) => setNewFileContent(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleUploadFile}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<UploadFileIcon />}
                  >
                    Browse
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFileDialog(false)}>Cancel</Button>
          <Button onClick={confirmAddFile} variant="contained" disabled={!newFileName.trim()}>Add File</Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={openRenameDialog} onClose={() => setOpenRenameDialog(false)}>
        <DialogTitle>Rename "{selectedNode ? selectedNode.name : ''}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            variant="outlined"
            value={renamingNodeName}
            onChange={(e) => setRenamingNodeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenameDialog(false)}>Cancel</Button>
          <Button onClick={confirmRename} variant="contained" disabled={!renamingNodeName.trim()}>Rename</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KnowledgeBaseManagement;