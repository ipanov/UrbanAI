#!/usr/bin/env node

/**
 * MANDATORY Development Server Startup Script
 * 
 * CRITICAL: This script MUST be used to start development servers.
 * NEVER start servers manually without this script.
 * 
 * This script enforces the EXACT ports from configuration files:
 * - API: Port 5001 (from src/UrbanAI.API/Properties/launchSettings.json)
 * - Frontend: Port 3000 (from src/UrbanAI.API/appsettings.json OAuth config)
 * 
 * NO EXCEPTIONS. NO PORT CHANGES. NO OVERRIDES.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const CONFIG_PORTS = {
  API: 5001,
  FRONTEND: 3000
};

function logStep(message) {
  console.log(`🚀 ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function validateConfigPorts() {
  logStep('Validating configuration ports...');
  
  try {
    // Validate API port from launchSettings.json
    const launchSettingsPath = path.join(process.cwd(), 'src/UrbanAI.API/Properties/launchSettings.json');
    const launchSettings = JSON.parse(fs.readFileSync(launchSettingsPath, 'utf8'));
    const apiUrl = launchSettings.profiles.http.applicationUrl;
    
    if (!apiUrl.includes(`localhost:${CONFIG_PORTS.API}`)) {
      throw new Error(`API port mismatch. Expected ${CONFIG_PORTS.API}, found in config: ${apiUrl}`);
    }
    
    // Validate Frontend port from appsettings.json
    const appsettingsPath = path.join(process.cwd(), 'src/UrbanAI.API/appsettings.json');
    const appsettings = JSON.parse(fs.readFileSync(appsettingsPath, 'utf8'));
    const frontendUrl = appsettings.OAuth.RedirectUris.Development.BaseUrl;
    
    if (!frontendUrl.includes(`localhost:${CONFIG_PORTS.FRONTEND}`)) {
      throw new Error(`Frontend port mismatch. Expected ${CONFIG_PORTS.FRONTEND}, found in config: ${frontendUrl}`);
    }
    
    logSuccess(`Configuration validated - API:${CONFIG_PORTS.API}, Frontend:${CONFIG_PORTS.FRONTEND}`);
  } catch (error) {
    logError(`Configuration validation failed: ${error.message}`);
    process.exit(1);
  }
}

function killAllProcesses() {
  logStep('Killing all existing development processes...');
  
  try {
    // Kill processes on specific ports
    const ports = [CONFIG_PORTS.API, CONFIG_PORTS.FRONTEND, 5101, 3100, 4173, 5173]; // Include common wrong ports
    
    ports.forEach(port => {
      try {
        // Use netstat to find process on port, then kill it
        const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
        if (result) {
          const lines = result.split('\\n');
          lines.forEach(line => {
            const parts = line.trim().split(/\\s+/);
            if (parts.length >= 5 && parts[1].includes(`${port}`)) {
              const pid = parts[parts.length - 1];
              if (pid && pid !== '0') {
                execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' });
                logSuccess(`Killed process ${pid} on port ${port}`);
              }
            }
          });
        }
      } catch (error) {
        // Port not in use, which is fine
      }
    });
    
    // Kill by process name as backup
    try {
      execSync('taskkill /F /IM dotnet.exe', { stdio: 'pipe' });
    } catch (error) {
      // No dotnet processes, which is fine
    }
    
    try {
      execSync('taskkill /F /IM node.exe', { stdio: 'pipe' });
    } catch (error) {
      // No node processes, which is fine
    }
    
    logSuccess('All processes killed successfully');
  } catch (error) {
    logError(`Error killing processes: ${error.message}`);
    // Continue anyway
  }
}

function validatePortsAreFree() {
  logStep('Validating ports are free...');
  
  [CONFIG_PORTS.API, CONFIG_PORTS.FRONTEND].forEach(port => {
    try {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
      if (result) {
        logError(`Port ${port} is still in use after cleanup!`);
        console.log(`Port usage: ${result}`);
        process.exit(1);
      }
    } catch (error) {
      // Port is free, which is what we want
    }
  });
  
  logSuccess('All required ports are free');
}

function startApiServer() {
  logStep(`Starting API server on port ${CONFIG_PORTS.API}...`);
  
  return new Promise((resolve, reject) => {
    const apiProcess = spawn('dotnet', ['run'], {
      cwd: path.join(process.cwd(), 'src/UrbanAI.API'),
      stdio: 'pipe'
    });
    
    let output = '';
    apiProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(`[API] ${data}`);
      
      if (output.includes(`Now listening on: http://localhost:${CONFIG_PORTS.API}`)) {
        logSuccess(`API server started successfully on port ${CONFIG_PORTS.API}`);
        resolve(apiProcess);
      } else if (output.includes(`Now listening on:`) && !output.includes(`localhost:${CONFIG_PORTS.API}`)) {
        logError('API server started on WRONG PORT!');
        apiProcess.kill();
        reject(new Error('API server started on wrong port'));
      }
    });
    
    apiProcess.stderr.on('data', (data) => {
      process.stderr.write(`[API ERROR] ${data}`);
    });
    
    apiProcess.on('error', (error) => {
      logError(`API server failed to start: ${error.message}`);
      reject(error);
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!output.includes(`Now listening on: http://localhost:${CONFIG_PORTS.API}`)) {
        logError('API server startup timeout');
        apiProcess.kill();
        reject(new Error('API server startup timeout'));
      }
    }, 30000);
  });
}

function startFrontendServer() {
  logStep(`Starting Frontend server on port ${CONFIG_PORTS.FRONTEND}...`);
  
  return new Promise((resolve, reject) => {
    const frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(process.cwd(), 'src/UrbanAI.Frontend'),
      stdio: 'pipe'
    });
    
    let output = '';
    frontendProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(`[FRONTEND] ${data}`);
      
      if (output.includes(`http://localhost:${CONFIG_PORTS.FRONTEND}/`)) {
        logSuccess(`Frontend server started successfully on port ${CONFIG_PORTS.FRONTEND}`);
        resolve(frontendProcess);
      } else if (output.includes(`http://localhost:`) && !output.includes(`localhost:${CONFIG_PORTS.FRONTEND}`)) {
        logError('Frontend server started on WRONG PORT!');
        frontendProcess.kill();
        reject(new Error('Frontend server started on wrong port'));
      }
    });
    
    frontendProcess.stderr.on('data', (data) => {
      process.stderr.write(`[FRONTEND ERROR] ${data}`);
    });
    
    frontendProcess.on('error', (error) => {
      logError(`Frontend server failed to start: ${error.message}`);
      reject(error);
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!output.includes(`http://localhost:${CONFIG_PORTS.FRONTEND}/`)) {
        logError('Frontend server startup timeout');
        frontendProcess.kill();
        reject(new Error('Frontend server startup timeout'));
      }
    }, 30000);
  });
}

async function main() {
  console.log('🚀 UrbanAI Development Server Startup');
  console.log('=====================================');
  console.log(`📋 Enforced Ports: API=${CONFIG_PORTS.API}, Frontend=${CONFIG_PORTS.FRONTEND}`);
  console.log('⚠️  NEVER START SERVERS MANUALLY - ALWAYS USE THIS SCRIPT');
  console.log('');
  
  try {
    validateConfigPorts();
    killAllProcesses();
    
    // Wait for processes to fully terminate
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    validatePortsAreFree();
    
    // Start servers in sequence
    const apiProcess = await startApiServer();
    
    // Wait a moment for API to fully start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const frontendProcess = await startFrontendServer();
    
    console.log('');
    logSuccess('🎉 All development servers started successfully!');
    console.log(`📡 API: http://localhost:${CONFIG_PORTS.API}`);
    console.log(`🌐 Frontend: http://localhost:${CONFIG_PORTS.FRONTEND}`);
    console.log('');
    console.log('💡 Press Ctrl+C to stop all servers');
    
    // Handle shutdown
    process.on('SIGINT', () => {
      console.log('\\n🛑 Shutting down development servers...');
      apiProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
    
    // Keep the script running
    process.stdin.resume();
    
  } catch (error) {
    logError(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();