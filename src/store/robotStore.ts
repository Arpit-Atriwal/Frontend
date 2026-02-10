// src/store/robotStore.ts

import { create } from 'zustand';
import { RobotState, RobotConfiguration, JointLimit } from '../types/robot.types';

interface RobotStore {
  // State
  robotState: RobotState;
  configuration: RobotConfiguration | null;
  jointLimits: JointLimit[];
  availablePorts: string[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  statusMessage: string;
  
  // Actions
  setRobotState: (state: RobotState) => void;
  setConfiguration: (config: RobotConfiguration) => void;
  setJointLimits: (limits: JointLimit[]) => void;
  setAvailablePorts: (ports: string[]) => void;
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;
  setStatusMessage: (message: string) => void;
  updateJointPosition: (index: number, value: number) => void;
}

const initialRobotState: RobotState = {
  jointPositions: [0, 0, 0, 0, 0, 0],
  targetPositions: [0, 0, 0, 0, 0, 0],
  cartesianPosition: null,
  isHomed: false,
  isMoving: false,
  isConnected: false,
  emergencyStop: false,
  status: 'Disconnected',
  lastUpdate: new Date().toISOString(),
};

export const useRobotStore = create<RobotStore>((set) => ({
  robotState: initialRobotState,
  configuration: null,
  jointLimits: [],
  availablePorts: [],
  connectionStatus: 'disconnected',
  statusMessage: 'Ready',
  
  setRobotState: (state) => set({ robotState: state }),
  
  setConfiguration: (config) => set({ 
    configuration: config,
    jointLimits: config.jointLimits 
  }),
  
  setJointLimits: (limits) => set({ jointLimits: limits }),
  
  setAvailablePorts: (ports) => set({ availablePorts: ports }),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setStatusMessage: (message) => set({ statusMessage: message }),
  
  updateJointPosition: (index, value) => set((state) => ({
    robotState: {
      ...state.robotState,
      jointPositions: state.robotState.jointPositions.map((pos, i) => 
        i === index ? value : pos
      ),
    },
  })),
}));
