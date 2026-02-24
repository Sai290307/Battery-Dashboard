import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Zoom,
  Fade,
  Typography
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import { alpha } from '@mui/material/styles';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const FilterBar: React.FC<Props> = ({ 
  searchTerm, 
  onSearchChange, 
  activeFilters, 
  onFilterChange 
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = React.useState<string>('');

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, type: string) => {
    setAnchorEl(event.currentTarget);
    setFilterType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFilterType('');
  };

  const addFilter = (value: string) => {
    if (!activeFilters.includes(value)) {
      onFilterChange([...activeFilters, value]);
    }
    handleClose();
  };

  const removeFilter = (filterToRemove: string) => {
    onFilterChange(activeFilters.filter(f => f !== filterToRemove));
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  // Filter options
  const filterOptions = {
    line: ['Line A', 'Line B', 'Line C'],
    status: ['OK', 'NG'],
    inspector: ['John D.', 'Jane S.', 'Mike R.']
  };

  return (
    <Fade in={true}>
      <Paper sx={{ 
        p: 2.5,
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.3)',
      }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          {/* Search Bar */}
          <TextField
            placeholder="Search by ID, inspector, or notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              flex: 2,
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: alpha('#f7fafc', 0.8),
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: '#ffffff',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)'
                },
                '&.Mui-focused': {
                  bgcolor: '#ffffff',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#a0aec0' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange('')}>
                    <ClearRoundedIcon sx={{ fontSize: 18, color: '#a0aec0' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Filter Buttons */}
          <Box display="flex" gap={1}>
            <Tooltip title="Filter by Line" arrow TransitionComponent={Zoom}>
              <IconButton
                onClick={(e) => handleFilterClick(e, 'line')}
                sx={{
                  bgcolor: activeFilters.some(f => f.startsWith('Line:')) ? alpha('#667eea', 0.1) : 'transparent',
                  border: '1px solid',
                  borderColor: activeFilters.some(f => f.startsWith('Line:')) ? '#667eea' : alpha('#e2e8f0', 0.5),
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.05),
                    borderColor: '#667eea'
                  }
                }}
              >
                <FilterListRoundedIcon sx={{ color: activeFilters.some(f => f.startsWith('Line:')) ? '#667eea' : '#718096' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter by Status" arrow TransitionComponent={Zoom}>
              <IconButton
                onClick={(e) => handleFilterClick(e, 'status')}
                sx={{
                  bgcolor: activeFilters.some(f => f.startsWith('Status:')) ? alpha('#667eea', 0.1) : 'transparent',
                  border: '1px solid',
                  borderColor: activeFilters.some(f => f.startsWith('Status:')) ? '#667eea' : alpha('#e2e8f0', 0.5),
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.05),
                    borderColor: '#667eea'
                  }
                }}
              >
                <FilterListRoundedIcon sx={{ color: activeFilters.some(f => f.startsWith('Status:')) ? '#667eea' : '#718096' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter by Inspector" arrow TransitionComponent={Zoom}>
              <IconButton
                onClick={(e) => handleFilterClick(e, 'inspector')}
                sx={{
                  bgcolor: activeFilters.some(f => f.startsWith('Inspector:')) ? alpha('#667eea', 0.1) : 'transparent',
                  border: '1px solid',
                  borderColor: activeFilters.some(f => f.startsWith('Inspector:')) ? '#667eea' : alpha('#e2e8f0', 0.5),
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.05),
                    borderColor: '#667eea'
                  }
                }}
              >
                <FilterListRoundedIcon sx={{ color: activeFilters.some(f => f.startsWith('Inspector:')) ? '#667eea' : '#718096' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Sort" arrow TransitionComponent={Zoom}>
              <IconButton
                sx={{
                  border: '1px solid',
                  borderColor: alpha('#e2e8f0', 0.5),
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.05),
                    borderColor: '#667eea'
                  }
                }}
              >
                <SortRoundedIcon sx={{ color: '#718096' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Date Range" arrow TransitionComponent={Zoom}>
              <IconButton
                sx={{
                  border: '1px solid',
                  borderColor: alpha('#e2e8f0', 0.5),
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.05),
                    borderColor: '#667eea'
                  }
                }}
              >
                <DateRangeRoundedIcon sx={{ color: '#718096' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Box display="flex" alignItems="center" gap={1} mt={2} flexWrap="wrap">
            <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600, mr: 1 }}>
              Active Filters:
            </Typography>
            {activeFilters.map((filter, index) => (
              <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }} key={filter}>
                <Chip
                  label={filter}
                  onDelete={() => removeFilter(filter)}
                  size="small"
                  sx={{
                    bgcolor: alpha('#667eea', 0.1),
                    color: '#4a5568',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: '#a0aec0',
                      '&:hover': { color: '#e53e3e' }
                    },
                    '&:hover': {
                      bgcolor: alpha('#667eea', 0.15)
                    }
                  }}
                />
              </Zoom>
            ))}
            {activeFilters.length > 1 && (
              <Chip
                label="Clear All"
                onClick={clearAllFilters}
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  color: '#718096',
                  border: '1px dashed',
                  borderColor: '#cbd5e0',
                  '&:hover': {
                    borderColor: '#e53e3e',
                    color: '#e53e3e'
                  }
                }}
              />
            )}
          </Box>
        )}

        {/* Filter Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              minWidth: 200
            }
          }}
        >
          {filterType === 'line' && (
            <Box>
              {filterOptions.line.map(line => (
                <MenuItem key={line} onClick={() => addFilter(`Line: ${line}`)} sx={{ py: 1.5 }}>
                  {line}
                </MenuItem>
              ))}
            </Box>
          )}
          
          {filterType === 'status' && (
            <Box>
              {filterOptions.status.map(status => (
                <MenuItem key={status} onClick={() => addFilter(`Status: ${status}`)} sx={{ py: 1.5 }}>
                  {status}
                </MenuItem>
              ))}
            </Box>
          )}
          
          {filterType === 'inspector' && (
            <Box>
              {filterOptions.inspector.map(inspector => (
                <MenuItem key={inspector} onClick={() => addFilter(`Inspector: ${inspector}`)} sx={{ py: 1.5 }}>
                  {inspector}
                </MenuItem>
              ))}
            </Box>
          )}
        </Menu>
      </Paper>
    </Fade>
  );
};

export default FilterBar;
