// src/services/robotApi.ts

import axios from "axios";
import {
  RobotState,
  RobotConfiguration,
  RobotCommandResult,
  MoveCommand,
  JogCommand,
  RobotProgram,
} from "../types/robot.types";

const API_BASE_URL = "http://localhost:5132/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const robotApi = {
  // Robot Control
  async getState(): Promise<RobotState> {
    const response = await api.get<RobotState>("/robot/state");
    return response.data;
  },

  async connect(portName: string): Promise<{ message: string }> {
    const response = await api.post("/robot/connect", { portName });
    return response.data;
  },

  async disconnect(): Promise<{ message: string }> {
    const response = await api.post("/robot/disconnect");
    return response.data;
  },

  async move(command: MoveCommand): Promise<RobotCommandResult> {
    const response = await api.post<RobotCommandResult>("/robot/move", command);
    return response.data;
  },

  async jog(command: JogCommand): Promise<RobotCommandResult> {
    const response = await api.post<RobotCommandResult>("/robot/jog", command);
    return response.data;
  },

  async home(): Promise<RobotCommandResult> {
    const response = await api.post<RobotCommandResult>("/robot/home");
    return response.data;
  },

  async stop(): Promise<RobotCommandResult> {
    const response = await api.post<RobotCommandResult>("/robot/stop");
    return response.data;
  },

  async emergencyStop(): Promise<RobotCommandResult> {
    const response = await api.post<RobotCommandResult>(
      "/robot/emergency-stop",
    );
    return response.data;
  },

  async setSpeed(speedPercent: number): Promise<RobotCommandResult> {
    const response = await api.post<RobotCommandResult>("/robot/speed", {
      speedPercent,
    });
    return response.data;
  },

  async getPorts(): Promise<string[]> {
    const response = await api.get<string[]>("/robot/ports");
    return response.data;
  },

  // Configuration
  async getConfiguration(): Promise<RobotConfiguration> {
    const response = await api.get<RobotConfiguration>("/configuration");
    return response.data;
  },

  async getJointLimits() {
    const response = await api.get("/configuration/limits");
    return response.data;
  },

  async getDHParameters() {
    const response = await api.get("/configuration/dh-parameters");
    return response.data;
  },

  // Programs
  async listPrograms(): Promise<string[]> {
    const response = await api.get<string[]>("/program");
    return response.data;
  },

  async loadProgram(name: string): Promise<RobotProgram> {
    const response = await api.get<RobotProgram>(`/program/${name}`);
    return response.data;
  },

  async saveProgram(
    name: string,
    program: RobotProgram,
  ): Promise<{ message: string; name: string }> {
    const response = await api.post("/program", { name, program });
    return response.data;
  },

  async deleteProgram(name: string): Promise<{ message: string }> {
    const response = await api.delete(`/program/${name}`);
    return response.data;
  },
};
