// src/components/Layout/Header.tsx

import { Box, Typography, IconButton, Chip } from "@mui/material";
import { motion } from "framer-motion";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import { useRobotStore } from "../../store/robotStore";

const Header = () => {
  const { robotState, connectionStatus } = useRobotStore();

  const getStatusColor = () => {
    if (robotState.emergencyStop) return "error";
    if (robotState.isMoving) return "warning";
    if (robotState.isConnected) return "success";
    return "default";
  };

  const getStatusLabel = () => {
    if (robotState.emergencyStop) return "E-STOP";
    if (robotState.isMoving) return "MOVING";
    if (robotState.isConnected) return "CONNECTED";
    if (connectionStatus === "connecting") return "CONNECTING";
    return "OFFLINE";
  };

  return (
    <Box
      sx={{
        height: 70,
        background:
          "linear-gradient(180deg, rgba(21, 27, 38, 0.95) 0%, rgba(10, 14, 20, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 217, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        position: "relative",
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 217, 255, 0.1)",
      }}
    >
      {/* Left: Logo and Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "4px",
              background: "linear-gradient(135deg, #00D9FF 0%, #0077FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 30px rgba(0, 217, 255, 0.5)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 2,
                borderRadius: "2px",
                background: "#0A0E14",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 900,
                color: "#00D9FF",
                fontFamily: '"Orbitron", monospace',
                position: "relative",
                zIndex: 1,
              }}
            >
              AR
            </Typography>
          </Box>
        </motion.div>

        <Box>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Orbitron", monospace',
                fontWeight: 700,
                color: "#E8EAED",
                letterSpacing: "0.15em",
                textShadow: "0 0 10px rgba(0, 217, 255, 0.3)",
              }}
            >
              AR4-MK3
            </Typography>
          </motion.div>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#00D9FF",
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "0.1em",
                fontSize: "0.7rem",
              }}
            >
              6-AXIS CONTROL SYSTEM v1.0
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* Center: Status Indicators */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Chip
            label={getStatusLabel()}
            color={getStatusColor()}
            size="medium"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              letterSpacing: "0.1em",
              fontSize: "0.75rem",
              height: 32,
              px: 1,
              animation: robotState.isMoving
                ? "pulse 1.5s ease-in-out infinite"
                : "none",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.6 },
              },
              boxShadow: robotState.emergencyStop
                ? "0 0 20px rgba(255, 61, 113, 0.6)"
                : robotState.isConnected
                  ? "0 0 20px rgba(0, 255, 148, 0.4)"
                  : "none",
            }}
          />
        </motion.div>

        {robotState.isConnected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: "4px",
                border: "1px solid rgba(0, 217, 255, 0.2)",
                background: "rgba(0, 217, 255, 0.05)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#9AA0A6",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.65rem",
                }}
              >
                HOMED:
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: robotState.isHomed ? "#00FF94" : "#FF3D71",
                  boxShadow: robotState.isHomed
                    ? "0 0 10px rgba(0, 255, 148, 0.6)"
                    : "0 0 10px rgba(255, 61, 113, 0.6)",
                }}
              />
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Right: Actions */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <IconButton
            sx={{
              color: "#00D9FF",
              border: "1px solid rgba(0, 217, 255, 0.3)",
              "&:hover": {
                bgcolor: "rgba(0, 217, 255, 0.1)",
                borderColor: "#00D9FF",
              },
            }}
          >
            <InfoIcon />
          </IconButton>
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <IconButton
            sx={{
              color: "#00D9FF",
              border: "1px solid rgba(0, 217, 255, 0.3)",
              "&:hover": {
                bgcolor: "rgba(0, 217, 255, 0.1)",
                borderColor: "#00D9FF",
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Header;
