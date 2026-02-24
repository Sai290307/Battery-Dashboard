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
} from "@mui/material";
import BatteryTable from "./components/BatteryTable";
import axios from "axios";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

interface Metrics {
  total_batteries: number;
  ok_count: number;
  ng_count: number;
}

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<"OK" | "NG">("OK");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search to avoid too many API calls
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
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: "#667eea",
              mb: 3,
            }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            color="#2d3748"
            gutterBottom
          >
            Loading Dashboard
          </Typography>
          <Typography variant="body2" color="#718096">
            Please wait while we fetch the latest data...
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
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            maxWidth: 400,
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <ErrorRoundedIcon sx={{ fontSize: 80, color: "#f56565", mb: 2 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            color="#2d3748"
            gutterBottom
          >
            Connection Error
          </Typography>
          <Typography variant="body1" color="#718096" paragraph>
            {error}
          </Typography>
          <Typography variant="body2" color="#a0aec0">
            Please check your connection and refresh the page
          </Typography>
        </Paper>
      </Box>
    );

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        minHeight: "100vh",
        pb: 6,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Premium Header */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: alpha("#e2e8f0", 0.5),
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
                  bgcolor: "#667eea",
                  width: 48,
                  height: 48,
                  boxShadow: "0 10px 20px -5px rgba(102, 126, 234, 0.3)",
                }}
              >
                <AssessmentRoundedIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="800"
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Inspection Analytics
                </Typography>
                <Typography variant="body2" color="#718096">
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
                  borderColor: alpha("#667eea", 0.2),
                  bgcolor: alpha("#ffffff", 0.9),
                  transition: "all 0.3s ease",
                  "&:focus-within": {
                    borderColor: "#667eea",
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                    width: 350,
                  },
                }}
              >
                <InputBase
                  sx={{ ml: 2, flex: 1, fontSize: "0.95rem" }}
                  placeholder="Search by ID or timestamp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{ color: alpha("#667eea", 0.6), fontSize: 20 }}
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
                            sx={{ fontSize: 18, color: "#a0aec0" }}
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
                  bgcolor: alpha("#667eea", 0.1),
                  color: "#4a5568",
                  border: "1px solid",
                  borderColor: alpha("#667eea", 0.2),
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Stat Cards */}
        <Grid container spacing={3} mb={5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Zoom in={true} style={{ transitionDelay: "100ms" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
                  border: "1px solid",
                  borderColor: alpha("#e2e8f0", 0.5),
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",

                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 30px 60px -15px rgba(0,0,0,0.2)",
                    borderColor: alpha("#6366f1", 0.4),
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#718096", fontWeight: 600 }}
                      >
                        Total Scanned
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{ color: "#2d3748", mt: 1 }}
                      >
                        {metrics?.total_batteries.toLocaleString()}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: alpha("#667eea", 0.1),
                        color: "#667eea",
                        width: 70,
                        height: 70,
                      }}
                    >
                      <AssessmentRoundedIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Zoom in={true} style={{ transitionDelay: "200ms" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
                  border: "1px solid",
                  borderColor: alpha("#e2e8f0", 0.5),
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                   transition: 'all 0.3s ease',
        cursor: 'pointer',

        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)',
          borderColor: alpha('#6366f1', 0.4),
        },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#718096", fontWeight: 600 }}
                      >
                        Passed (OK)
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{ color: "#48bb78" }}
                      >
                        {metrics?.ok_count.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="#718096" mt={1}>
                        {calculatePercentage(metrics?.ok_count || 0)}% of total
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: alpha("#48bb78", 0.1),
                        color: "#48bb78",
                        width: 70,
                        height: 70,
                      }}
                    >
                      <CheckCircleRoundedIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }} sx={{ overflow: 'visible' }}>
  <Zoom in={true} style={{ transitionDelay: "300ms" }}>
    <Box
      sx={{
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
          border: "1px solid",
          borderColor: alpha("#e2e8f0", 0.5),
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',

          '&:hover': {
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)',
            borderColor: alpha('#6366f1', 0.4),
          },
        }}
      >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: "#718096", fontWeight: 600 }}
                      >
                        Failed (NG)
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{ color: "#f56565" }}
                      >
                        {metrics?.ng_count.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="#718096" mt={1}>
                        {calculatePercentage(metrics?.ng_count || 0)}% of total
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: alpha("#f56565", 0.1),
                        color: "#f56565",
                        width: 70,
                        height: 70,
                      }}
                    >
                      <ErrorRoundedIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
              </Box>
            </Zoom>
          </Grid>
        </Grid>

        {/* Active Search Indicator */}
        {debouncedSearchTerm && (
          <Fade in={true}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`Searching for: "${debouncedSearchTerm}"`}
                onDelete={handleClearSearch}
                deleteIcon={<ClearRoundedIcon />}
                size="small"
                sx={{
                  bgcolor: alpha("#667eea", 0.1),
                  color: "#4a5568",
                  border: "1px solid",
                  borderColor: alpha("#667eea", 0.2),
                  fontWeight: 500,
                }}
              />
            </Box>
          </Fade>
        )}

        {/* Data Area */}
        <Fade in={true} timeout={1000}>
          <Paper
            sx={{
              borderRadius: 4,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
              border: "1px solid",
              borderColor: alpha("#e2e8f0", 0.5),
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: alpha("#e2e8f0", 0.5),
                bgcolor: "#ffffff",
                px: 2,
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, val) => setTabValue(val)}
                textColor="inherit"
                sx={{
                  "& .MuiTab-root": {
                    py: 3,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#718096",
                    textTransform: "none",
                  },
                  "& .Mui-selected": {
                    color: "#667eea !important",
                    fontWeight: 700,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#667eea",
                    height: 3,
                  },
                }}
              >
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleRoundedIcon fontSize="small" />
                      Passed Inspections
                    </Box>
                  }
                  value="OK"
                />
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <ErrorRoundedIcon fontSize="small" />
                      Failed Inspections
                    </Box>
                  }
                  value="NG"
                />
              </Tabs>
            </Box>
            <Box sx={{ bgcolor: "#ffffff" }}>
              <BatteryTable
                status={tabValue}
                searchTerm={debouncedSearchTerm}
              />
            </Box>
          </Paper>
        </Fade>

        {/* Footer */}
        <Box
          component="footer"
          sx={{ mt: 4, textAlign: "center", color: "#718096" }}
        >
          <Typography variant="caption">
            © {new Date().getFullYear()} Battery Inspection System • All rights
            reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default App;
