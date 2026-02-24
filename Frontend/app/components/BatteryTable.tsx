"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Pagination, Box,
  Typography, Chip, IconButton, Tooltip, Paper,
  Skeleton, Fade, Zoom, alpha,
  Avatar, Collapse, Grid, LinearProgress,
  Card, CardContent
} from '@mui/material';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ImageModal from './ImageModal';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ImageSearchRoundedIcon from '@mui/icons-material/ImageSearchRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

interface BatteryItem {
  battery_id: number;
  timestamp: string;
  status: string;
  image_path: string; // This now contains the full URL from the API
  image_filename: string;
}

interface BatteryResponse {
  items: BatteryItem[];
  page: number;
  page_size: number;
  total: number;
}

interface Props {
  status: 'OK' | 'NG';
  searchTerm: string;
}

const BatteryTable: React.FC<Props> = ({ status, searchTerm }) => {
  const [data, setData] = useState<BatteryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const pageSize = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const params: any = { 
        status, 
        page: currentPage, 
        page_size: pageSize
      };
      
      if (searchTerm && searchTerm.trim() !== '') {
        params.search = searchTerm.trim();
      }
      
      try {
        const response = await axios.get(`http://localhost:8000/api/batteries`, { params });
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, currentPage, searchTerm]);

  // UPDATED: Simply accept the full URL from the API item
  const handleViewImage = (fullUrl: string) => {
    if (!fullUrl) return;
    console.log("Opening Image URL:", fullUrl);
    setSelectedImageUrl(fullUrl);
    setModalOpen(true);
  };

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const getStatusColor = (status: string) => {
    return status === 'OK' 
      ? { 
          bg: alpha('#48bb78', 0.1), 
          color: '#2f855a', 
          border: '#48bb78',
          light: alpha('#48bb78', 0.05)
        }
      : { 
          bg: alpha('#f56565', 0.1), 
          color: '#c53030', 
          border: '#f56565',
          light: alpha('#f56565', 0.05)
        };
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  if (loading) {
    return (
      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight={600} color="#2d3748">
            Loading Data
          </Typography>
          <LinearProgress sx={{ width: 200, borderRadius: 5 }} />
        </Box>
        {[...Array(5)].map((_, index) => (
          <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }} key={index}>
            <Card sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={2}><Skeleton variant="circular" width={32} height={32} /></Grid>
                  <Grid size={2}><Skeleton variant="text" width={60} /></Grid>
                  <Grid size={2}><Skeleton variant="text" width={120} /></Grid>
                  <Grid size={2}><Skeleton variant="text" width={80} /></Grid>
                  <Grid size={2}><Box display="flex" justifyContent="flex-end"><Skeleton variant="rectangular" width={40} height={40} /></Box></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={8} textAlign="center">
        <Zoom in={true}>
          <Paper sx={{ p: 5, borderRadius: 4 }}>
            <ErrorRoundedIcon sx={{ fontSize: 80, color: alpha('#f56565', 0.5), mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color="#2d3748" gutterBottom>
              {error}
            </Typography>
          </Paper>
        </Zoom>
      </Box>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <Fade in={true}>
      <Box>
        {/* Table Header with Stats */}
        <Box sx={{ 
          p: 2, 
          bgcolor: alpha('#f7fafc', 0.5),
          borderBottom: '1px solid',
          borderColor: alpha('#e2e8f0', 0.5),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={`${data?.total || 0} Records Found`}
              size="small"
              sx={{
                bgcolor: data?.total === 0 ? alpha('#f56565', 0.1) : '#667eea',
                color: data?.total === 0 ? '#c53030' : 'white',
                fontWeight: 600,
              }}
            />
            {searchTerm && (
              <Typography variant="body2" color="#718096">
                Search results for: <strong>{searchTerm}</strong>
              </Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeRoundedIcon sx={{ fontSize: 16, color: '#a0aec0' }} />
            <Typography variant="caption" color="#a0aec0">
              Real-time updates
            </Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha('#f8fafc', 0.8) }}>
                <TableCell sx={{ width: 50, pl: 3 }} />
                <TableCell sx={{ fontWeight: 700 }}>Battery ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Inspection Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((item) => {
                const statusColors = getStatusColor(item.status);
                const formattedDate = formatDate(item.timestamp);
                const isExpanded = expandedRow === item.battery_id;
                
                return (
                  <React.Fragment key={item.battery_id}>
                    <TableRow hover sx={{ borderBottom: '1px solid', borderColor: alpha('#e2e8f0', 0.5) }}>
                      <TableCell sx={{ pl: 3 }}>
                        <IconButton
                          size="small"
                          onClick={() => setExpandedRow(isExpanded ? null : item.battery_id)}
                        >
                          {isExpanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: statusColors.bg, color: statusColors.color,fontSize: '0.95rem',fontWeight: 600 }}>
                            #{item.battery_id.toString().slice(-2)}
                          </Avatar>
                          <Typography fontWeight={600}>
                            BAT-{String(item.battery_id).padStart(6, '0')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {formattedDate.date}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#718096' }}>
                            {formattedDate.time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          icon={item.status === 'OK' ? <CheckCircleRoundedIcon /> : <ErrorRoundedIcon />}
                          sx={{
                            fontWeight: 700,
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Tooltip title={item.image_path ? "View Image" : "No Image"} arrow>
                          <span>
                            <IconButton
                              // UPDATED: Pass item.image_path instead of filename
                              onClick={() => handleViewImage(item.image_path)}
                              disabled={!item.image_path}
                              size="small"
                              sx={{
                                color: item.image_path ? '#667eea' : '#cbd5e0',
                              }}
                            >
                              <ImageSearchRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Details */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 3, bgcolor: alpha('#f8fafc', 0.7) }}>
                            <Grid container spacing={3}>
                              <Grid size={{ xs: 6, md: 3 }}>
                                <Typography variant="caption" color="#718096">Battery ID</Typography>
                                <Typography variant="body2" fontWeight={700}>BAT-{String(item.battery_id).padStart(6, '0')}</Typography>
                              </Grid>
                              <Grid size={{ xs: 6, md: 3 }}>
                                <Typography variant="caption" color="#718096">Inspection Time</Typography>
                                <Typography variant="body2">{formattedDate.date} at {formattedDate.time}</Typography>
                              </Grid>
                              <Grid size={{ xs: 6, md: 3 }}>
                                <Typography variant="caption" color="#718096">Status</Typography>
                                <Chip label={item.status} size="small" sx={{ bgcolor: statusColors.bg, color: statusColors.color }} />
                              </Grid>
                              <Grid size={{ xs: 6, md: 3 }}>
                                <Typography variant="caption" color="#718096">Image</Typography>
                                <Typography variant="body2">{item.image_path ? 'Available' : 'Not Available'}</Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Zoom in={true}>
                      <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 500, mx: 'auto' }}>
                         <SearchOffRoundedIcon sx={{ fontSize: 80, color: alpha('#a0aec0', 0.5), mb: 2 }} />
                         <Typography variant="h5" fontWeight={700} color="#4a5568" gutterBottom>
                           No Records Found
                         </Typography>
                         <Typography variant="body1" color="#718096">
                           No {status} inspections found {searchTerm ? `matching "${searchTerm}"` : ''}
                         </Typography>
                      </Paper>
                    </Zoom>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && data && data.items.length > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" py={3} px={3}>
            <Typography variant="body2" color="#718096">
              Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, data?.total || 0)} of {data?.total}
            </Typography>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              shape="rounded"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        <ImageModal open={modalOpen} onClose={() => setModalOpen(false)} imageUrl={selectedImageUrl} />
      </Box>
    </Fade>
  );
};

export default BatteryTable;