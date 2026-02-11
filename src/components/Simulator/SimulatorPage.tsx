// src/components/Simulator/SimulatorPage.tsx

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Slider,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Box as DreiBox } from "@react-three/drei";
import * as THREE from "three";

const MuiBox = Box as any;

interface VirtualRobotState {
  jointPositions: number[];
  targetPositions: number[];
  isMoving: boolean;
  speed: number;
}

const VirtualRobot3D = ({ jointPositions }: { jointPositions: number[] }) => {
  return (
    <group>
      {/* Base */}
      <DreiBox args={[1, 0.2, 1]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#00D9FF" metalness={0.8} roughness={0.2} />
      </DreiBox>

      {/* Joint 1 - Base rotation */}
      <group
        rotation={[0, THREE.MathUtils.degToRad(jointPositions[0] || 0), 0]}
      >
        <DreiBox args={[0.3, 0.5, 0.3]} position={[0, 0.45, 0]}>
          <meshStandardMaterial color="#1E88E5" />
        </DreiBox>

        {/* Joint 2 - Shoulder */}
        <group
          position={[0, 0.7, 0]}
          rotation={[THREE.MathUtils.degToRad(jointPositions[1] || 0), 0, 0]}
        >
          <DreiBox args={[0.25, 1, 0.25]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#1976D2" />
          </DreiBox>

          {/* Joint 3 - Elbow */}
          <group
            position={[0, 1, 0]}
            rotation={[THREE.MathUtils.degToRad(jointPositions[2] || 0), 0, 0]}
          >
            <DreiBox args={[0.2, 0.8, 0.2]} position={[0, 0.4, 0]}>
              <meshStandardMaterial color="#1565C0" />
            </DreiBox>

            {/* Joint 4 - Wrist rotation */}
            <group
              position={[0, 0.8, 0]}
              rotation={[
                0,
                0,
                THREE.MathUtils.degToRad(jointPositions[3] || 0),
              ]}
            >
              <DreiBox args={[0.15, 0.3, 0.15]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#0D47A1" />
              </DreiBox>

              {/* Joint 5 - Wrist pitch */}
              <group
                position={[0, 0.3, 0]}
                rotation={[
                  THREE.MathUtils.degToRad(jointPositions[4] || 0),
                  0,
                  0,
                ]}
              >
                <DreiBox args={[0.12, 0.2, 0.12]} position={[0, 0.1, 0]}>
                  <meshStandardMaterial color="#0D47A1" />
                </DreiBox>

                {/* Joint 6 - End effector */}
                <group
                  position={[0, 0.2, 0]}
                  rotation={[
                    0,
                    0,
                    THREE.MathUtils.degToRad(jointPositions[5] || 0),
                  ]}
                >
                  <DreiBox args={[0.1, 0.05, 0.1]} position={[0, 0.025, 0]}>
                    <meshStandardMaterial
                      color="#FF3D71"
                      emissive="#FF3D71"
                      emissiveIntensity={0.5}
                    />
                  </DreiBox>
                  {/* Tool marker */}
                  <mesh position={[0, 0.1, 0]}>
                    <sphereGeometry args={[0.03]} />
                    <meshStandardMaterial
                      color="#00FF94"
                      emissive="#00FF94"
                      emissiveIntensity={1}
                    />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const SimulatorPage = () => {
  const [virtualRobot, setVirtualRobot] = useState<VirtualRobotState>({
    jointPositions: [0, 0, 0, 0, 0, 0],
    targetPositions: [0, 0, 0, 0, 0, 0],
    isMoving: false,
    speed: 50,
  });

  const [simulationRunning, setSimulationRunning] = useState(false);
  const [animateMotion, setAnimateMotion] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [presetMotion, setPresetMotion] = useState<string | null>(null);

  // Smooth motion animation
  useEffect(() => {
    if (!animateMotion) {
      // Instant motion
      setVirtualRobot((prev) => ({
        ...prev,
        jointPositions: [...prev.targetPositions],
        isMoving: false,
      }));
      return;
    }

    // Animated motion
    const interval = setInterval(() => {
      setVirtualRobot((prev) => {
        const newPositions = prev.jointPositions.map((current, index) => {
          const target = prev.targetPositions[index];
          const diff = target - current;

          if (Math.abs(diff) < 0.1) return target;

          const step = (diff / 10) * (prev.speed / 50);
          return current + step;
        });

        const isMoving = newPositions.some(
          (pos, i) => Math.abs(pos - prev.targetPositions[i]) > 0.1,
        );

        return {
          ...prev,
          jointPositions: newPositions,
          isMoving,
        };
      });
    }, 50); // 20 Hz update

    return () => clearInterval(interval);
  }, [virtualRobot.targetPositions, virtualRobot.speed, animateMotion]);

  const handleJointChange = (index: number, value: number) => {
    setVirtualRobot((prev) => {
      const newTargets = [...prev.targetPositions];
      newTargets[index] = value;
      return { ...prev, targetPositions: newTargets };
    });
  };

  const handleReset = () => {
    setVirtualRobot((prev) => ({
      ...prev,
      jointPositions: [0, 0, 0, 0, 0, 0],
      targetPositions: [0, 0, 0, 0, 0, 0],
      isMoving: false,
    }));
    setPresetMotion(null);
  };

  const runPresetMotion = (preset: string) => {
    setPresetMotion(preset);

    const presets: { [key: string]: number[] } = {
      home: [0, 0, 0, 0, 0, 0],
      wave: [45, 30, -45, 0, 60, 0],
      reach: [0, 60, -30, 0, 45, 0],
      pick: [90, 45, -60, 0, 90, 0],
      place: [-90, 45, -60, 0, 90, 180],
    };

    if (presets[preset]) {
      setVirtualRobot((prev) => ({
        ...prev,
        targetPositions: presets[preset],
      }));
    }
  };

  const runDemoSequence = async () => {
    setSimulationRunning(true);
    const sequence = ["home", "wave", "reach", "pick", "place", "home"];

    for (const motion of sequence) {
      runPresetMotion(motion);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setSimulationRunning(false);
    setPresetMotion(null);
  };

  const jointLimits = [
    { min: -170, max: 170 },
    { min: -42, max: 90 },
    { min: -89, max: 52 },
    { min: -165, max: 165 },
    { min: -105, max: 105 },
    { min: -155, max: 155 },
  ];

  return (
    <MuiBox sx={{ display: "flex", height: "calc(100vh - 110px)", gap: 2, p: 2 }}>
      {/* Left Panel - Controls */}
      <MuiBox
        sx={{
          width: 350,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        {/* Simulator Status */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            background: "rgba(21, 27, 38, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 217, 255, 0.2)",
          }}
        >
          <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TimelineIcon sx={{ color: "#00D9FF" }} />
            <Typography
              sx={{
                fontFamily: '"Orbitron", monospace',
                fontWeight: 600,
                fontSize: "16px",
                letterSpacing: "0.05em",
              }}
            >
              SIMULATOR MODE
            </Typography>
          </MuiBox>

          <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Chip
              label={virtualRobot.isMoving ? "MOVING" : "IDLE"}
              color={virtualRobot.isMoving ? "warning" : "success"}
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />

            <MuiBox sx={{ display: "flex", gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={animateMotion}
                    onChange={(e) => setAnimateMotion(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#00D9FF",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#00D9FF",
                        },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.75rem",
                    }}
                  >
                    Animate
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showTrajectory}
                    onChange={(e) => setShowTrajectory(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#00D9FF",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#00D9FF",
                        },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.75rem",
                    }}
                  >
                    Trail
                  </Typography>
                }
              />
            </MuiBox>

            <MuiBox>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.75rem",
                  color: "#9AA0A6",
                  mb: 1,
                }}
              >
                Speed: {virtualRobot.speed}%
              </Typography>
              <Slider
                value={virtualRobot.speed}
                onChange={(_, value) =>
                  setVirtualRobot((prev) => ({
                    ...prev,
                    speed: value as number,
                  }))
                }
                min={10}
                max={100}
                sx={{
                  color: "#00D9FF",
                  "& .MuiSlider-thumb": {
                    boxShadow: "0 0 10px rgba(0, 217, 255, 0.5)",
                  },
                }}
              />
            </MuiBox>
          </MuiBox>
        </Paper>

        {/* Preset Motions */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            background: "rgba(21, 27, 38, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 217, 255, 0.2)",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 600,
              fontSize: "14px",
              mb: 2,
            }}
          >
            PRESET MOTIONS
          </Typography>

          <MuiBox sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {["Home", "Wave", "Reach", "Pick", "Place"].map((preset) => (
              <Button
                key={preset}
                variant="outlined"
                onClick={() => runPresetMotion(preset.toLowerCase())}
                disabled={simulationRunning}
                sx={{
                  borderColor:
                    presetMotion === preset.toLowerCase()
                      ? "#00D9FF"
                      : "rgba(0, 217, 255, 0.3)",
                  color:
                    presetMotion === preset.toLowerCase()
                      ? "#00D9FF"
                      : "#9AA0A6",
                  bgcolor:
                    presetMotion === preset.toLowerCase()
                      ? "rgba(0, 217, 255, 0.1)"
                      : "transparent",
                  "&:hover": {
                    borderColor: "#00D9FF",
                    bgcolor: "rgba(0, 217, 255, 0.1)",
                  },
                }}
              >
                {preset}
              </Button>
            ))}
          </MuiBox>

          <Button
            fullWidth
            variant="contained"
            onClick={runDemoSequence}
            disabled={simulationRunning}
            startIcon={simulationRunning ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{
              mt: 2,
              bgcolor: "#00D9FF",
              color: "#0A0E14",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#5FFFFF",
              },
            }}
          >
            {simulationRunning ? "RUNNING..." : "RUN DEMO"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            startIcon={<RestartAltIcon />}
            sx={{
              mt: 1,
              borderColor: "rgba(255, 184, 0, 0.3)",
              color: "#FFB800",
              "&:hover": {
                borderColor: "#FFB800",
                bgcolor: "rgba(255, 184, 0, 0.1)",
              },
            }}
          >
            RESET
          </Button>
        </Paper>

        {/* Joint Controls */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            background: "rgba(21, 27, 38, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0, 217, 255, 0.2)",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 600,
              fontSize: "14px",
              mb: 2,
            }}
          >
            MANUAL CONTROL
          </Typography>

          {virtualRobot.jointPositions.map((position, index) => (
            <MuiBox key={index} sx={{ mb: 2.5 }}>
              <MuiBox
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.75rem",
                    color: "#9AA0A6",
                  }}
                >
                  JOINT {index + 1}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.875rem",
                    color: "#00D9FF",
                    fontWeight: 600,
                  }}
                >
                  {position.toFixed(1)}°
                </Typography>
              </MuiBox>
              <Slider
                value={virtualRobot.targetPositions[index]}
                onChange={(_, value) =>
                  handleJointChange(index, value as number)
                }
                min={jointLimits[index].min}
                max={jointLimits[index].max}
                disabled={simulationRunning}
                sx={{
                  color: "#00D9FF",
                  "& .MuiSlider-thumb": {
                    boxShadow: "0 0 10px rgba(0, 217, 255, 0.5)",
                  },
                }}
              />
            </MuiBox>
          ))}
        </Paper>
      </MuiBox>

      {/* Right Panel - 3D View */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          background: "rgba(10, 14, 20, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 217, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <MuiBox
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            bgcolor: "rgba(21, 27, 38, 0.9)",
            backdropFilter: "blur(10px)",
            p: 2,
            borderRadius: "4px",
            border: "1px solid rgba(0, 217, 255, 0.2)",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "0.05em",
            }}
          >
            VIRTUAL ROBOT
          </Typography>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              color: "#9AA0A6",
              fontSize: "0.65rem",
            }}
          >
            NO HARDWARE REQUIRED • SAFE TESTING ENVIRONMENT
          </Typography>
        </MuiBox>

        <Canvas
          camera={{ position: [3, 3, 3], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={["#0A0E14"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#00D9FF"
          />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            color="#00FF94"
          />

          <VirtualRobot3D jointPositions={virtualRobot.jointPositions} />

          <Grid
            args={[10, 10]}
            cellSize={1}
            cellThickness={1}
            cellColor="#00D9FF"
            sectionSize={5}
            sectionThickness={1.5}
            sectionColor="#0077FF"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Canvas>
      </Paper>
    </MuiBox>
  );
};

export default SimulatorPage;
