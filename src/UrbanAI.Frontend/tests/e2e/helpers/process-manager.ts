import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ProcessInfo {
  pid: number;
  port: number;
  name: string;
}

/**
 * Utility for managing test processes and ports
 * Provides robust process cleanup to avoid port conflicts
 */
export class ProcessManager {
  private static instance: ProcessManager;
  private trackedProcesses = new Set<number>();

  private constructor() {}

  static getInstance(): ProcessManager {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager();
    }
    return ProcessManager.instance;
  }

  /**
   * Kill process running on a specific port
   */
  async killProcessOnPort(port: number): Promise<boolean> {
    try {
      console.log(`🔍 Checking for processes on port ${port}...`);
      
      // For Windows
      if (process.platform === 'win32') {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        const lines = stdout.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5) {
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(Number(pid))) {
              try {
                await execAsync(`taskkill /PID ${pid} /F`);
                console.log(`⚡ Killed process ${pid} on port ${port}`);
                return true;
              } catch (error) {
                console.log(`⚠️  Could not kill process ${pid}: ${error}`);
              }
            }
          }
        }
      } else {
        // For Unix-like systems
        const { stdout } = await execAsync(`lsof -ti:${port}`);
        const pids = stdout.split('\n').filter(pid => pid.trim());
        
        for (const pid of pids) {
          if (pid.trim()) {
            try {
              await execAsync(`kill -9 ${pid}`);
              console.log(`⚡ Killed process ${pid} on port ${port}`);
              return true;
            } catch (error) {
              console.log(`⚠️  Could not kill process ${pid}: ${error}`);
            }
          }
        }
      }
      
      return false;
    } catch (error) {
      console.log(`⚠️  Error checking port ${port}: ${error}`);
      return false;
    }
  }

  /**
   * Check if port is available
   */
  async isPortAvailable(port: number): Promise<boolean> {
    try {
      if (process.platform === 'win32') {
        const { stdout } = await execAsync(`netstat -an | findstr :${port}`);
        return stdout.trim() === '';
      } else {
        const { stdout } = await execAsync(`lsof -i:${port}`);
        return stdout.trim() === '';
      }
    } catch {
      return true; // If command fails, assume port is available
    }
  }

  /**
   * Wait for port to be available
   */
  async waitForPortToBeFree(port: number, timeoutMs: number = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (await this.isPortAvailable(port)) {
        console.log(`✅ Port ${port} is now available`);
        return;
      }
      
      console.log(`⏳ Waiting for port ${port} to be available...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Timeout waiting for port ${port} to be available`);
  }

  /**
   * Wait for port to be occupied (server started)
   */
  async waitForPortToBeOccupied(port: number, timeoutMs: number = 60000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      if (!await this.isPortAvailable(port)) {
        console.log(`✅ Port ${port} is now occupied`);
        return;
      }
      
      console.log(`⏳ Waiting for port ${port} to be occupied...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Timeout waiting for port ${port} to be occupied`);
  }

  /**
   * Clean up all tracked processes
   */
  async cleanupAllProcesses(): Promise<void> {
    console.log('🧹 Cleaning up tracked processes...');
    
    for (const pid of this.trackedProcesses) {
      try {
        if (process.platform === 'win32') {
          await execAsync(`taskkill /PID ${pid} /F`);
        } else {
          await execAsync(`kill -9 ${pid}`);
        }
        console.log(`⚡ Killed tracked process ${pid}`);
      } catch (error) {
        console.log(`⚠️  Could not kill tracked process ${pid}: ${error}`);
      }
    }
    
    this.trackedProcesses.clear();
  }

  /**
   * Cleanup ports commonly used by the application and tests
   */
  async cleanupCommonPorts(): Promise<void> {
    const commonPorts = [3000, 5001, 7082, 3100, 5101]; // Dev ports + Test ports
    
    console.log('🧹 Cleaning up application and test ports...');
    
    for (const port of commonPorts) {
      await this.killProcessOnPort(port);
    }
  }

  /**
   * Track a process ID for cleanup
   */
  trackProcess(pid: number): void {
    this.trackedProcesses.add(pid);
  }

  /**
   * Get list of processes running on common ports
   */
  async getProcessesOnCommonPorts(): Promise<ProcessInfo[]> {
    const processes: ProcessInfo[] = [];
    const commonPorts = [3000, 5001, 7082, 3100, 5101]; // Dev ports + Test ports
    
    for (const port of commonPorts) {
      try {
        if (process.platform === 'win32') {
          const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
          const lines = stdout.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 5) {
              const pid = parseInt(parts[parts.length - 1]);
              if (!isNaN(pid)) {
                processes.push({ pid, port, name: `Process on port ${port}` });
              }
            }
          }
        } else {
          const { stdout } = await execAsync(`lsof -ti:${port}`);
          const pids = stdout.split('\n').filter(pid => pid.trim());
          
          for (const pidStr of pids) {
            const pid = parseInt(pidStr.trim());
            if (!isNaN(pid)) {
              processes.push({ pid, port, name: `Process on port ${port}` });
            }
          }
        }
      } catch {
        // Port not in use, continue
      }
    }
    
    return processes;
  }
}

// Singleton instance
export const processManager = ProcessManager.getInstance();