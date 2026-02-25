"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination,
  Box, Typography, Chip, IconButton, Tooltip, Paper, Skeleton, Fade, Zoom,
  alpha, Avatar, Collapse, Grid, LinearProgress, Card, CardContent, useTheme
} from "@mui/material";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ImageModal from "./ImageModal"; // Adjusted import path
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";


interface BatteryItem {
  battery_id: number;
  timestamp: string;
  status: string;
  image_path: string;
  image_filename: string;
}

interface BatteryResponse {
  items: BatteryItem[];
  page: number;
  page_size: number;
  total: number;
}

interface Props {
  status: "OK" | "NG";
  searchTerm: string;
}

const BatteryTable: React.FC<Props> = ({ status, searchTerm }) => {
  const theme = useTheme(); // HOOK
  const [data, setData] = useState<BatteryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const pageSize = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params: any = { status, page: currentPage, page_size: pageSize };
      if (searchTerm && searchTerm.trim() !== "") params.search = searchTerm.trim();
      
      try {
        const response = await axios.get("http://localhost:8000/api/batteries", { params });
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status, currentPage, searchTerm]);

  const handleViewImage = (fullUrl: string) => {
    if (!fullUrl) return;
    setSelectedImageUrl(fullUrl);
    setModalOpen(true);
  };

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    const isDark = theme.palette.mode === 'dark';
    return status === "OK"
      ? {
          bg: alpha(theme.palette.success.main, 0.15),
          color: isDark ? theme.palette.success.light : theme.palette.success.dark,
          border: theme.palette.success.main,
          light: alpha(theme.palette.success.main, 0.05),
        }
      : {
          bg: alpha(theme.palette.error.main, 0.15),
          color: isDark ? theme.palette.error.light : theme.palette.error.dark,
          border: theme.palette.error.main,
          light: alpha(theme.palette.error.main, 0.05),
        };
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };
  };

  if (loading) {
    return (
      <Box p={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight={600} color="text.primary">Loading Data</Typography>
          <LinearProgress sx={{ width: 200, borderRadius: 5 }} />
        </Box>
        {[...Array(5)].map((_, index) => (
          <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }} key={index}>
            <Card sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid  size={2}><Skeleton variant="circular" width={32} height={32} /></Grid>
                  <Grid size={10}><Skeleton variant="text" width="100%" /></Grid>
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
          <Paper sx={{ p: 5, borderRadius: 4, bgcolor: "background.paper" }}>
            <ErrorRoundedIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>{error}</Typography>
          </Paper>
        </Zoom>
      </Box>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <Fade in={true}>
      <Box>
        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={`${data?.total || 0} Records Found`}
              size="small"
              sx={{
                bgcolor: data?.total === 0 ? alpha(theme.palette.error.main, 0.1) : "primary.main",
                color: data?.total === 0 ? "error.main" : "white",
                fontWeight: 600,
              }}
            />
            {searchTerm && <Typography variant="body2" color="text.secondary">Search results for: <strong>{searchTerm}</strong></Typography>}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">Real-time updates</Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.background.default, 0.8) }}>
                <TableCell sx={{ width: 50, pl: 3 }} />
                <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>Battery ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>Inspection Time</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "text.primary" }}>Status</TableCell>
                <TableCell align="right" sx={{ pr: 3, color: "text.primary" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((item) => {
                const statusColors = getStatusColor(item.status);
                const formattedDate = formatDate(item.timestamp);
                const isExpanded = expandedRow === item.battery_id;

                return (
                  <React.Fragment key={item.battery_id}>
                    <TableRow hover sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                      <TableCell sx={{ pl: 3 }}>
                        <IconButton size="small" onClick={() => setExpandedRow(isExpanded ? null : item.battery_id)}>
                          {isExpanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: statusColors.bg, color: statusColors.color, fontSize: "0.95rem", fontWeight: 600 }}>
                            #{item.battery_id.toString().slice(-2)}
                          </Avatar>
                          <Typography fontWeight={600} color="text.primary">BAT-{String(item.battery_id).padStart(6, "0")}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500} color="text.primary">{formattedDate.date}</Typography>
                          <Typography variant="caption" color="text.secondary">{formattedDate.time}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status} size="small"
                          icon={item.status === "OK" ? <CheckCircleRoundedIcon /> : <ErrorRoundedIcon />}
                          sx={{ fontWeight: 700, bgcolor: statusColors.bg, color: statusColors.color }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Tooltip title={item.image_path ? "View Image" : "No Image"} arrow>
                          <span>
                            <IconButton onClick={() => handleViewImage(item.image_path)} disabled={!item.image_path} size="small" sx={{ color: item.image_path ? "primary.main" : "action.disabled" }}>
                              <ImageSearchRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, borderBottom: "none" }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ px: 4, py: 3, bgcolor: alpha(theme.palette.background.default, 0.5), borderTop: "1px solid", borderColor: "divider" }}>
                            <Grid container spacing={3}>
                              <Grid size={{xs:12,sm:6,md:3}}>
                                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>Battery ID</Typography>
                                  <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700, color: "text.primary" }}>BAT-{String(item.battery_id).padStart(6, "0")}</Typography>
                                </Paper>
                              </Grid>
                              <Grid size={{xs:12,sm:6,md:3}}>
                                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>Inspection Time</Typography>
                                  <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5, color: "text.primary" }}>{formattedDate.date}</Typography>
                                  <Typography variant="caption" color="text.secondary">{formattedDate.time}</Typography>
                                </Paper>
                              </Grid>
                              <Grid size={{xs:12,sm:6,md:3}}>
                                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: statusColors.border, bgcolor: statusColors.light }}>
                                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>Inspection Status</Typography>
                                  <Box mt={1}>
                                    <Chip label={item.status === "OK" ? "Passed Inspection" : "Failed Inspection"} size="small" icon={item.status === "OK" ? <CheckCircleRoundedIcon /> : <ErrorRoundedIcon />} sx={{ fontWeight: 700, bgcolor: statusColors.bg, color: statusColors.color }} />
                                  </Box>
                                </Paper>
                              </Grid>
                              <Grid size={{xs:12,sm:6,md:3}}>
                                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                                  <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 600, color: "text.secondary" }}>Inspection Image</Typography>
                                  <Typography variant="body2" sx={{ mt: 1, color: "text.primary" }}>{item.image_path ? "Image Available" : "No Image Available"}</Typography>
                                  {item.image_path && (
                                    <Box mt={2}>
                                      <Chip label="Preview Image" size="small" icon={<ImageSearchRoundedIcon />} onClick={() => handleViewImage(item.image_path)} sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", cursor: "pointer" }} />
                                    </Box>
                                  )}
                                </Paper>
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
                      <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 500, mx: "auto", bgcolor: "background.paper" }}>
                        <SearchOffRoundedIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                        <Typography variant="h5" fontWeight={700} color="text.secondary" gutterBottom>No Records Found</Typography>
                        <Typography variant="body1" color="text.secondary">No {status} inspections found {searchTerm ? `matching "${searchTerm}"` : ""}</Typography>
                      </Paper>
                    </Zoom>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination logic remains the same, colors inherit automatically */}
         {totalPages > 1 && data && data.items.length > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" py={3} px={3}>
            <Typography variant="body2" color="text.secondary">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, data?.total || 0)} of {data?.total}
            </Typography>
            <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} shape="rounded" size="large" showFirstButton showLastButton />
          </Box>
        )}
        <ImageModal open={modalOpen} onClose={() => setModalOpen(false)} imageUrl={selectedImageUrl} />
      </Box>
    </Fade>
  );
};
export default BatteryTable;