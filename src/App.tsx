// src/App.tsx

import { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import JointControlPanel from "./components/Controls/JointControlPanel";
import RobotViewer3D from "./components/Visualization/RobotViewer3D";
import ConnectionPanel from "./components/Controls/ConnectionPanel";
import StatusBar from "./components/Layout/StatusBar";
import SimulatorPage from "./components/Simulator/SimulatorPage";
import { signalRService } from "./services/signalrService";
import { robotApi } from "./services/robotApi";
import { useRobotStore } from "./store/robotStore";

// Industrial-Tech Theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00D9FF",
      light: "#5FFFFF",
      dark: "#00A7CC",
    },
    secondary: {
      main: "#FF3D71",
      light: "#FF6B95",
      dark: "#CC0033",
    },
    background: {
      default: "#0A0E14",
      paper: "#151B26",
    },
    text: {
      primary: "#E8EAED",
      secondary: "#9AA0A6",
    },
    success: {
      main: "#00FF94",
    },
    warning: {
      main: "#FFB800",
    },
    error: {
      main: "#FF3D71",
    },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
    h1: {
      fontFamily: '"Orbitron", "JetBrains Mono", monospace',
      fontWeight: 700,
      letterSpacing: "0.05em",
    },
    h2: {
      fontFamily: '"Orbitron", "JetBrains Mono", monospace',
      fontWeight: 600,
      letterSpacing: "0.05em",
    },
    h3: {
      fontFamily: '"Orbitron", "JetBrains Mono", monospace',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 600,
      letterSpacing: "0.08em",
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          borderRadius: "2px",
          padding: "10px 24px",
          fontSize: "0.875rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(0, 217, 255, 0.1)",
        },
      },
    },
  },
});

const MuiBox = Box as any;

function App() {
  const {
    setRobotState,
    setConfiguration,
    setAvailablePorts,
    setStatusMessage,
  } = useRobotStore();
  const [currentPage, setCurrentPage] = useState<"dashboard" | "simulator">(
    "dashboard",
  );

  useEffect(() => {
    // Only connect to backend for Dashboard mode
    if (currentPage === "dashboard") {
      // Load configuration
      robotApi
        .getConfiguration()
        .then((config) => setConfiguration(config))
        .catch((err) => console.error("Failed to load configuration:", err));

      // Load available ports
      robotApi
        .getPorts()
        .then((ports) => setAvailablePorts(ports))
        .catch((err) => console.error("Failed to load ports:", err));

      // Connect to SignalR
      signalRService.onStateUpdate = (state) => {
        setRobotState(state);
      };

      signalRService.onStatusMessage = (message) => {
        setStatusMessage(message);
      };

      signalRService.onError = (error) => {
        console.error("SignalR Error:", error);
        setStatusMessage(`Error: ${error.message || "Unknown error"}`);
      };

      signalRService
        .connect()
        .then((connected) => {
          if (connected) {
            setStatusMessage("Real-time connection established");
          }
        })
        .catch((err) => {
          console.error("Failed to connect to SignalR:", err);
          setStatusMessage(
            "Real-time connection failed - Running in offline mode",
          );
        });

      return () => {
        signalRService.disconnect();
      };
    } else {
      // Simulator mode - no backend needed
      setStatusMessage("Simulator mode - No hardware required");
    }
  }, [
    currentPage,
    setRobotState,
    setConfiguration,
    setAvailablePorts,
    setStatusMessage,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiBox
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "linear-gradient(135deg, #0A0E14 0%, #151B26 100%)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(0, 217, 255, 0.05) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Header */}
        <Header />

        {/* Main Content */}
        <MuiBox sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ height: "100%" }}
          >
            <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          </motion.div>

          {/* Page Content */}
          <AnimatePresence mode="wait">
            {currentPage === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", flex: 1, overflow: "hidden" }}
              >
                {/* Dashboard - Center: 3D Visualization */}
                <MuiBox
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    overflow: "hidden",
                  }}
                >
                  <RobotViewer3D />
                </MuiBox>

                {/* Dashboard - Right Panel: Controls */}
                <MuiBox
                  sx={{
                    width: 400,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 2,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "rgba(0, 217, 255, 0.05)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(0, 217, 255, 0.3)",
                      borderRadius: "4px",
                      "&:hover": {
                        background: "rgba(0, 217, 255, 0.5)",
                      },
                    },
                  }}
                >
                  <ConnectionPanel />
                  <JointControlPanel />
                </MuiBox>
              </motion.div>
            ) : (
              <motion.div
                key="simulator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, overflow: "hidden" }}
              >
                <SimulatorPage />
              </motion.div>
            )}
          </AnimatePresence>
        </MuiBox>

        {/* Status Bar */}
        <StatusBar />
      </MuiBox>
    </ThemeProvider>
  );
}

export default App;
