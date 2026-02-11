// src/components/Controls/JointControlPanel.tsx

import {
  Box,
  Paper,
  Typography,
  Slider,
  IconButton,
  Button,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HomeIcon from "@mui/icons-material/Home";
import StopIcon from "@mui/icons-material/Stop";
import WarningIcon from "@mui/icons-material/Warning";
import { useRobotStore } from "../../store/robotStore";
import { signalRService } from "../../services/signalrService";

const MuiBox = Box as any;

const jointsContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  mb: 3,
};

const JointControlPanel = () => {
  const { robotState, jointLimits } = useRobotStore();

  const handleJog = async (jointIndex: number, delta: number) => {
    await signalRService.jog({
      jointIndex,
      deltaDegrees: delta,
      speed: 50,
    });
  };

  const handleHome = async () => {
    await signalRService.home();
  };

  const handleStop = async () => {
    await signalRService.stop();
  };

  const handleEmergencyStop = async () => {
    await signalRService.emergencyStop();
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
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Orbitron", monospace',
          fontWeight: 600,
          color: "#E8EAED",
          letterSpacing: "0.05em",
          mb: 2.5,
        }}
      >
        JOINT CONTROL
      </Typography>

      {/* Joints */}
      <MuiBox sx={jointsContainerSx}>
        {robotState.jointPositions.map((position, index) => {
          const limit = jointLimits[index];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MuiBox>
                <MuiBox
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      color: "#9AA0A6",
                      fontSize: "0.75rem",
                    }}
                  >
                    JOINT {index + 1}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      color: "#00D9FF",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {position.toFixed(2)}°
                  </Typography>
                </MuiBox>

                <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleJog(index, -1)}
                    disabled={!robotState.isConnected}
                    sx={{
                      border: "1px solid rgba(0, 217, 255, 0.3)",
                      color: "#00D9FF",
                      "&:hover": {
                        bgcolor: "rgba(0, 217, 255, 0.1)",
                        borderColor: "#00D9FF",
                      },
                      "&:disabled": {
                        borderColor: "rgba(0, 217, 255, 0.1)",
                        color: "rgba(0, 217, 255, 0.3)",
                      },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Slider
                    value={position}
                    min={limit?.minDegrees || -180}
                    max={limit?.maxDegrees || 180}
                    disabled={!robotState.isConnected}
                    sx={{
                      flex: 1,
                      color: "#00D9FF",
                      "& .MuiSlider-thumb": {
                        width: 16,
                        height: 16,
                        boxShadow: "0 0 10px rgba(0, 217, 255, 0.5)",
                      },
                      "& .MuiSlider-track": {
                        height: 4,
                      },
                      "& .MuiSlider-rail": {
                        height: 4,
                        opacity: 0.3,
                      },
                    }}
                  />

                  <IconButton
                    size="small"
                    onClick={() => handleJog(index, 1)}
                    disabled={!robotState.isConnected}
                    sx={{
                      border: "1px solid rgba(0, 217, 255, 0.3)",
                      color: "#00D9FF",
                      "&:hover": {
                        bgcolor: "rgba(0, 217, 255, 0.1)",
                        borderColor: "#00D9FF",
                      },
                      "&:disabled": {
                        borderColor: "rgba(0, 217, 255, 0.1)",
                        color: "rgba(0, 217, 255, 0.3)",
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </MuiBox>
              </MuiBox>
            </motion.div>
          );
        })}
      </MuiBox>

      {/* Action Buttons */}
      <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={handleHome}
          disabled={!robotState.isConnected}
          sx={{
            borderColor: "rgba(0, 217, 255, 0.3)",
            color: "#00D9FF",
            fontWeight: 600,
            py: 1.2,
            "&:hover": {
              borderColor: "#00D9FF",
              bgcolor: "rgba(0, 217, 255, 0.1)",
            },
            "&:disabled": {
              borderColor: "rgba(0, 217, 255, 0.1)",
              color: "rgba(0, 217, 255, 0.3)",
            },
          }}
        >
          HOME
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<StopIcon />}
          onClick={handleStop}
          disabled={!robotState.isConnected}
          sx={{
            borderColor: "rgba(255, 184, 0, 0.3)",
            color: "#FFB800",
            fontWeight: 600,
            py: 1.2,
            "&:hover": {
              borderColor: "#FFB800",
              bgcolor: "rgba(255, 184, 0, 0.1)",
            },
            "&:disabled": {
              borderColor: "rgba(255, 184, 0, 0.1)",
              color: "rgba(255, 184, 0, 0.3)",
            },
          }}
        >
          STOP
        </Button>

        <Button
          fullWidth
          variant="contained"
          startIcon={<WarningIcon />}
          onClick={handleEmergencyStop}
          sx={{
            bgcolor: "#FF3D71",
            color: "#FFF",
            fontWeight: 700,
            py: 1.5,
            animation: "pulse-red 2s ease-in-out infinite",
            "@keyframes pulse-red": {
              "0%, 100%": {
                boxShadow: "0 0 0 0 rgba(255, 61, 113, 0.7)",
              },
              "50%": {
                boxShadow: "0 0 20px 10px rgba(255, 61, 113, 0)",
              },
            },
            "&:hover": {
              bgcolor: "#CC0033",
              boxShadow: "0 0 30px rgba(255, 61, 113, 0.6)",
            },
          }}
        >
          EMERGENCY STOP
        </Button>
      </MuiBox>
    </Paper>
  );
};

export default JointControlPanel;
