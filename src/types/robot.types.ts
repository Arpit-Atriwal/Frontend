// src/types/robot.types.ts

export interface RobotState {
  jointPositions: number[];
  targetPositions: number[];
  cartesianPosition: CartesianPosition | null;
  isHomed: boolean;
  isMoving: boolean;
  isConnected: boolean;
  emergencyStop: boolean;
  status: string;
  lastUpdate: string;
}

export interface CartesianPosition {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
}

export interface MoveCommand {
  jointAngles?: number[];
  cartesianTarget?: CartesianPosition;
  speed?: number;
  waitForCompletion?: boolean;
}

export interface JogCommand {
  jointIndex: number;
  deltaDegrees: number;
  speed?: number;
}

export interface RobotCommandResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export interface JointLimit {
  jointName: string;
  minDegrees: number;
  maxDegrees: number;
  maxSpeed: number;
  maxAcceleration: number;
}

export interface RobotConfiguration {
  name: string;
  degreesOfFreedom: number;
  dhParameters: DHParameter[];
  jointLimits: JointLimit[];
  serial: SerialConfiguration;
}

export interface DHParameter {
  jointName: string;
  a: number;
  d: number;
  alpha: number;
  theta: number;
}

export interface SerialConfiguration {
  portName: string;
  baudRate: number;
  readTimeout: number;
  writeTimeout: number;
}

export interface RobotProgram {
  name: string;
  description: string;
  steps: ProgramStep[];
  createdAt: string;
  modifiedAt: string;
}

export interface ProgramStep {
  stepNumber: number;
  type: string;
  jointAngles?: number[];
  speed: number;
  delayMs: number;
  parameters?: Record<string, any>;
}
