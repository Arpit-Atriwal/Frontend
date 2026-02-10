// src/components/Controls/ConnectionPanel.tsx

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import UsbIcon from "@mui/icons-material/Usb";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import { useRobotStore } from "../../store/robotStore";
import { signalRService } from "../../services/signalrService";

const ConnectionPanel = () => {
  const { availablePorts, robotState, setStatusMessage } = useRobotStore();
  const [selectedPort, setSelectedPort] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (!selectedPort) return;

    setConnecting(true);
    setStatusMessage("Connecting to robot...");

    try {
      const success = await signalRService.connectRobot(selectedPort);
      if (success) {
        setStatusMessage(`Connected to ${selectedPort}`);
      } else {
        setStatusMessage("Connection failed");
      }
    } catch (error) {
      setStatusMessage(`Error: ${error}`);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await signalRService.disconnectRobot();
    setStatusMessage("Disconnected");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        background: "rgba(21, 27, 38, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 217, 255, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 217, 255, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <motion.div
          animate={{ rotate: robotState.isConnected ? 0 : [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <UsbIcon sx={{ color: "#00D9FF", fontSize: 24 }} />
        </motion.div>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 600,
            color: "#E8EAED",
            letterSpacing: "0.05em",
          }}
        >
          CONNECTION
        </Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.875rem",
            color: "#9AA0A6",
          }}
        >
          Serial Port
        </InputLabel>
        <Select
          value={selectedPort}
          onChange={(e) => setSelectedPort(e.target.value)}
          disabled={robotState.isConnected}
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.875rem",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 217, 255, 0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 217, 255, 0.4)",
            },
          }}
        >
          {availablePorts.map((port) => (
            <MenuItem key={port} value={port}>
              {port}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!robotState.isConnected ? (
        <Button
          fullWidth
          variant="contained"
          onClick={handleConnect}
          disabled={!selectedPort || connecting}
          startIcon={<PowerIcon />}
          sx={{
            bgcolor: "#00D9FF",
            color: "#0A0E14",
            fontWeight: 700,
            py: 1.5,
            "&:hover": {
              bgcolor: "#5FFFFF",
              boxShadow: "0 0 25px rgba(0, 217, 255, 0.5)",
            },
            "&:disabled": {
              bgcolor: "rgba(0, 217, 255, 0.2)",
              color: "rgba(232, 234, 237, 0.3)",
            },
          }}
        >
          {connecting ? "CONNECTING..." : "CONNECT"}
        </Button>
      ) : (
        <Button
          fullWidth
          variant="outlined"
          onClick={handleDisconnect}
          startIcon={<PowerOffIcon />}
          sx={{
            borderColor: "#FF3D71",
            color: "#FF3D71",
            fontWeight: 700,
            py: 1.5,
            "&:hover": {
              borderColor: "#FF6B95",
              bgcolor: "rgba(255, 61, 113, 0.1)",
              boxShadow: "0 0 25px rgba(255, 61, 113, 0.3)",
            },
          }}
        >
          DISCONNECT
        </Button>
      )}
    </Paper>
  );
};

export default ConnectionPanel;
