// src/components/Visualization/RobotViewer3D.tsx

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Box as DreiBox } from "@react-three/drei";
import { Box, Paper, Typography } from "@mui/material";
import * as THREE from "three";
import { useRobotStore } from "../../store/robotStore";

const Robot3DModel = () => {
  const { robotState } = useRobotStore();

  // Simplified robot visualization - cylinders for joints
  return (
    <group>
      {/* Base */}
      <DreiBox args={[1, 0.2, 1]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#00D9FF" metalness={0.8} roughness={0.2} />
      </DreiBox>

      {/* Joint 1 - Base rotation */}
      <group
        rotation={[
          0,
          THREE.MathUtils.degToRad(robotState.jointPositions[0] || 0),
          0,
        ]}
      >
        <DreiBox args={[0.3, 0.5, 0.3]} position={[0, 0.45, 0]}>
          <meshStandardMaterial color="#1E88E5" />
        </DreiBox>

        {/* Joint 2 - Shoulder */}
        <group
          position={[0, 0.7, 0]}
          rotation={[
            THREE.MathUtils.degToRad(robotState.jointPositions[1] || 0),
            0,
            0,
          ]}
        >
          <DreiBox args={[0.25, 1, 0.25]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#1976D2" />
          </DreiBox>

          {/* Joint 3 - Elbow */}
          <group
            position={[0, 1, 0]}
            rotation={[
              THREE.MathUtils.degToRad(robotState.jointPositions[2] || 0),
              0,
              0,
            ]}
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
                THREE.MathUtils.degToRad(robotState.jointPositions[3] || 0),
              ]}
            >
              <DreiBox args={[0.15, 0.3, 0.15]} position={[0, 0.15, 0]}>
                <meshStandardMaterial color="#0D47A1" />
              </DreiBox>

              {/* Joint 5 - Wrist pitch */}
              <group
                position={[0, 0.3, 0]}
                rotation={[
                  THREE.MathUtils.degToRad(robotState.jointPositions[4] || 0),
                  0,
                  0,
                ]}
              >
                <DreiBox args={[0.12, 0.2, 0.12]} position={[0, 0.1, 0]}>
                  <meshStandardMaterial color="#0D47A1" />
                </DreiBox>

                {/* Joint 6 - Wrist roll / End effector */}
                <group
                  position={[0, 0.2, 0]}
                  rotation={[
                    0,
                    0,
                    THREE.MathUtils.degToRad(robotState.jointPositions[5] || 0),
                  ]}
                >
                  <DreiBox args={[0.1, 0.05, 0.1]} position={[0, 0.025, 0]}>
                    <meshStandardMaterial
                      color="#FF3D71"
                      emissive="#FF3D71"
                      emissiveIntensity={0.3}
                    />
                  </DreiBox>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const RobotViewer3D = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        background: "rgba(10, 14, 20, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 217, 255, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 217, 255, 0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
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
          variant="h6"
          sx={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 600,
            color: "#E8EAED",
            letterSpacing: "0.05em",
          }}
        >
          3D VIEWPORT
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            color: "#9AA0A6",
            fontSize: "0.65rem",
          }}
        >
          ORBIT: LEFT CLICK | PAN: RIGHT CLICK | ZOOM: SCROLL
        </Typography>
      </Box>

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

        <Robot3DModel />

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
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>
    </Paper>
  );
};

export default RobotViewer3D;
