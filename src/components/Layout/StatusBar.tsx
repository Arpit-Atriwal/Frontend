// src/components/Layout/StatusBar.tsx

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useRobotStore } from "../../store/robotStore";

const StatusBar = () => {
  const { statusMessage, robotState } = useRobotStore();

  return (
    <Box
      sx={{
        height: 40,
        background:
          "linear-gradient(180deg, rgba(10, 14, 20, 0.95) 0%, rgba(21, 27, 38, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(0, 217, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        gap: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FiberManualRecordIcon
            sx={{
              fontSize: 12,
              color: robotState.isConnected ? "#00FF94" : "#9AA0A6",
            }}
          />
        </motion.div>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            color: "#E8EAED",
            fontSize: "0.75rem",
          }}
        >
          {statusMessage}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            color: "#9AA0A6",
            fontSize: "0.7rem",
          }}
        >
          SIGNALR: {robotState.isConnected ? "CONNECTED" : "DISCONNECTED"}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            color: "#9AA0A6",
            fontSize: "0.7rem",
          }}
        >
          FPS: 60
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            color: "#9AA0A6",
            fontSize: "0.7rem",
          }}
        >
          LATENCY: <span style={{ color: "#00FF94" }}>12ms</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default StatusBar;
