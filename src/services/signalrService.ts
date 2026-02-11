// src/services/signalrService.ts

import * as signalR from "@microsoft/signalr";
import {
  RobotState,
  RobotCommandResult,
  MoveCommand,
  JogCommand,
} from "../types/robot.types";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  // Event handlers
  public onStateUpdate: ((state: RobotState) => void) | null = null;
  public onStatusMessage: ((message: string) => void) | null = null;
  public onError: ((error: any) => void) | null = null;
  public onConnectionChange: ((connected: boolean) => void) | null = null;

  async connect(): Promise<boolean> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("Already connected");
      return true;
    }

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5132/hubs/robot")
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < 4) {
              return Math.min(
                1000 * Math.pow(2, retryContext.previousRetryCount),
                30000,
              );
            }
            return null;
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up event handlers
      this.connection.on("StateUpdate", (state: RobotState) => {
        if (this.onStateUpdate) {
          this.onStateUpdate(state);
        }
      });

      this.connection.on("StatusMessage", (message: string) => {
        if (this.onStatusMessage) {
          this.onStatusMessage(message);
        }
      });

      this.connection.on("Error", (error: any) => {
        console.error("SignalR Error:", error);
        if (this.onError) {
          this.onError(error);
        }
      });

      this.connection.onclose((error) => {
        console.log("SignalR connection closed", error);
        if (this.onConnectionChange) {
          this.onConnectionChange(false);
        }
      });

      this.connection.onreconnecting((error) => {
        console.log("SignalR reconnecting", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected", connectionId);
        if (this.onConnectionChange) {
          this.onConnectionChange(true);
        }
      });

      await this.connection.start();
      console.log("SignalR Connected");

      if (this.onConnectionChange) {
        this.onConnectionChange(true);
      }

      return true;
    } catch (error) {
      console.error("SignalR Connection Error:", error);
      if (this.onError) {
        this.onError(error);
      }
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // Hub method invocations
  async getState(): Promise<RobotState | null> {
    if (!this.connection) return null;
    try {
      return await this.connection.invoke<RobotState>("GetState");
    } catch (error) {
      console.error("Error getting state:", error);
      return null;
    }
  }

  async move(command: MoveCommand): Promise<RobotCommandResult | null> {
    if (!this.connection) return null;
    try {
      return await this.connection.invoke<RobotCommandResult>("Move", command);
    } catch (error) {
      console.error("Error moving:", error);
      return null;
    }
  }

  async jog(command: JogCommand): Promise<RobotCommandResult | null> {
    if (!this.connection) return null;
    try {
      return await this.connection.invoke<RobotCommandResult>("Jog", command);
    } catch (error) {
      console.error("Error jogging:", error);
      return null;
    }
  }

  async home(): Promise<RobotCommandResult | null> {
    if (!this.connection) return null;
    try {
      return await this.connection.invoke<RobotCommandResult>("Home");
    } catch (error) {
      console.error("Error homing:", error);
      return null;
    }
  }

  async stop(): Promise<RobotCommandResult | null> {
    if (!this.connection) return null;
    try {
      return await this.connection.invoke<RobotCommandResult>("Stop");
    } catch (error) {
      console.error("Error stopping:", error);
      return null;
    }
  }

  async emergencyStop(): Promise<RobotCommandResult | null> {
    if (!this.connection) return null;
    try {
      return await this.connection.invoke<RobotCommandResult>("EmergencyStop");
    } catch (error) {
      console.error("Error emergency stop:", error);
      return null;
    }
  }

  async connectRobot(portName: string): Promise<boolean | null> {
    if (!this.connection) return null;
    try {
      return await this.connection.invoke<boolean>("Connect", portName);
    } catch (error) {
      console.error("Error connecting to robot:", error);
      return null;
    }
  }

  async disconnectRobot(): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.invoke("Disconnect");
    } catch (error) {
      console.error("Error disconnecting robot:", error);
    }
  }
}

export const signalRService = new SignalRService();
