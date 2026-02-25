"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Avatar,
  alpha,
  Fade,
  Zoom,
  Chip,
  InputBase,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import BatteryTable from "./components/BatteryTable"; // Adjust path if needed
import axios from "axios";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { ThemeContextProvider, useColorMode } from "./ThemeContext"; // Import the context

interface Metrics {
  total_batteries: number;
  ok_count: number;
  ng_count: number;
}

// Create an inner component to use the Theme Hook
const DashboardContent: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<"OK" | "NG">("OK");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/metrics")
      .then((res) => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load metrics");
        console.log(err);
        setLoading(false);
      });
  }, []);

  const calculatePercentage = (value: number) => {
    if (!metrics?.total_batteries) return 0;
    return ((value / metrics.total_batteries) * 100).toFixed(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ bgcolor: "background.default" }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "primary.main", mb: 3 }} />
          <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
            Loading Dashboard
          </Typography>
        </Paper>
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: mode === 'light' 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
            : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            maxWidth: 400,
            bgcolor: "background.paper",
          }}
        >
          <ErrorRoundedIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
          <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
            Connection Error
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
        </Paper>
      </Box>
    );

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: 6,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Premium Header */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 48,
                  height: 48,
                  boxShadow: `0 10px 20px -5px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <AssessmentRoundedIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="800"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Inspection Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time battery inspection monitoring system
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              {/* Search Bar */}
              <Paper
                elevation={0}
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 300,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  bgcolor: alpha(theme.palette.background.paper, mode === 'dark' ? 1 : 0.9),
                  transition: "all 0.3s ease",
                  "&:focus-within": {
                    borderColor: "primary.main",
                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    width: 350,
                  },
                }}
              >
                <InputBase
                  sx={{ ml: 2, flex: 1, fontSize: "0.95rem", color: "text.primary" }}
                  placeholder="Search by ID or timestamp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{ color: alpha(theme.palette.primary.main, 0.6), fontSize: 20 }}
                      />
                    </InputAdornment>
                  }
                  endAdornment={
                    searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClearSearch}
                          sx={{ mr: 1 }}
                        >
                          <ClearRoundedIcon
                            sx={{ fontSize: 18, color: "text.secondary" }}
                          />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                />
              </Paper>

              <Chip
                icon={<BatteryChargingFullRoundedIcon />}
                label={`Last updated: ${new Date().toLocaleTimeString()}`}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  fontWeight: 500,
                }}
              />

              {/* Theme Toggle */}
              <IconButton onClick={toggleColorMode} color="inherit" sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }}>
                {mode === 'dark' ? <LightModeRoundedIcon color="warning" /> : <DarkModeRoundedIcon color="action" />}
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Stat Cards */}
        <Grid container spacing={3} mb={5}>
          {/* Total Scanned */}
          <Grid size={{xs:12, sm:4}}>
            <Zoom in={true} style={{ transitionDelay: "100ms" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: theme.shadows[2],
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        Total Scanned
                      </Typography>
                      <Typography variant="h3" fontWeight="800" sx={{ color: "text.primary", mt: 1 }}>
                        {metrics?.total_batteries.toLocaleString()}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", width: 70, height: 70 }}>
                      <AssessmentRoundedIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Passed */}
          <Grid size={{xs:12, sm:4}}>
            <Zoom in={true} style={{ transitionDelay: "200ms" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    borderColor: alpha(theme.palette.success.main, 0.4),
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        Passed (OK)
                      </Typography>
                      <Typography variant="h3" fontWeight="800" sx={{ color: "success.main" }}>
                        {metrics?.ok_count.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {calculatePercentage(metrics?.ok_count || 0)}% of total
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", width: 70, height: 70 }}>
                      <CheckCircleRoundedIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Failed */}
          <Grid size={{xs:12, sm:4}}>
            <Zoom in={true} style={{ transitionDelay: "300ms" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    borderColor: alpha(theme.palette.error.main, 0.4),
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="overline" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        Failed (NG)
                      </Typography>
                      <Typography variant="h3" fontWeight="800" sx={{ color: "error.main" }}>
                        {metrics?.ng_count.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {calculatePercentage(metrics?.ng_count || 0)}% of total
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: "error.main", width: 70, height: 70 }}>
                      <ErrorRoundedIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Data Area */}
        <Fade in={true} timeout={1000}>
          <Paper
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: mode === 'dark' ? alpha(theme.palette.common.black, 0.2) : theme.palette.common.white, px: 2 }}>
              <Tabs
                value={tabValue}
                onChange={(e, val) => setTabValue(val)}
                textColor="inherit"
                sx={{
                  "& .MuiTab-root": {
                    py: 3, px: 4, fontSize: "1rem", fontWeight: 600, color: "text.secondary", textTransform: "none",
                  },
                  "& .Mui-selected": {
                    color: "primary.main", fontWeight: 700,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main", height: 3,
                  },
                }}
              >
                <Tab label={<Box display="flex" alignItems="center" gap={1}><CheckCircleRoundedIcon fontSize="small" />Passed Inspections</Box>} value="OK" />
                <Tab label={<Box display="flex" alignItems="center" gap={1}><ErrorRoundedIcon fontSize="small" />Failed Inspections</Box>} value="NG" />
              </Tabs>
            </Box>
            <Box sx={{ bgcolor: "background.paper" }}>
              <BatteryTable status={tabValue} searchTerm={debouncedSearchTerm} />
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

// Export the wrapped App
const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <DashboardContent />
    </ThemeContextProvider>
  );
};

export default App;