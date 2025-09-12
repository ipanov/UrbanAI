#!/usr/bin/env node

/**
 * Port Validation Hook - Prevents Wrong Port Usage
 * 
 * This hook runs before any development server startup to ensure:
 * 1. No processes running on forbidden ports
 * 2. Config ports are validated and available
 * 3. Wrong startup commands are blocked
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENFORCED_PORTS = {
  API: 5001,
  FRONTEND: 3000
};

const FORBIDDEN_PORTS = [3100, 5101, 4173, 5173, 8080, 8000];

function logError(message) {
  console.error(`🚨 PORT VIOLATION: ${message}`);
}

function logSuccess(message) {
  console.log(`✅ PORT VALIDATION: ${message}`);
}

function validateConfigPorts() {
  try {
    // Validate API port in launchSettings.json
    const launchSettingsPath = path.join(process.cwd(), 'src/UrbanAI.API/Properties/launchSettings.json');
    if (fs.existsSync(launchSettingsPath)) {
      const launchSettings = JSON.parse(fs.readFileSync(launchSettingsPath, 'utf8'));
      const apiUrl = launchSettings.profiles.http.applicationUrl;
      
      if (!apiUrl.includes(`localhost:${ENFORCED_PORTS.API}`)) {
        logError(`API configuration corrupted. Expected port ${ENFORCED_PORTS.API}, found: ${apiUrl}`);
        return false;
      }
    }
    
    // Validate Frontend port in appsettings.json OAuth config
    const appsettingsPath = path.join(process.cwd(), 'src/UrbanAI.API/appsettings.json');
    if (fs.existsSync(appsettingsPath)) {
      const appsettings = JSON.parse(fs.readFileSync(appsettingsPath, 'utf8'));
      const frontendUrl = appsettings.OAuth.RedirectUris.Development.BaseUrl;
      
      if (!frontendUrl.includes(`localhost:${ENFORCED_PORTS.FRONTEND}`)) {
        logError(`Frontend configuration corrupted. Expected port ${ENFORCED_PORTS.FRONTEND}, found: ${frontendUrl}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logError(`Configuration validation failed: ${error.message}`);
    return false;
  }
}

function checkForbiddenPorts() {
  let violationsFound = false;
  
  // Check all forbidden ports
  [...Object.values(ENFORCED_PORTS), ...FORBIDDEN_PORTS].forEach(port => {
    try {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
      if (result) {
        logError(`Port ${port} is in use! This is ${FORBIDDEN_PORTS.includes(port) ? 'FORBIDDEN' : 'a required port conflict'}`);
        console.log(`   Process details: ${result}`);
        violationsFound = true;
      }
    } catch (error) {
      // Port is free, which is good
    }
  });
  
  return !violationsFound;
}

function killViolatingProcesses() {
  logSuccess('Killing all potentially violating processes...');
  
  try {
    // Kill all dotnet processes
    execSync('taskkill /F /IM dotnet.exe', { stdio: 'pipe' });
  } catch (error) {
    // No dotnet processes running
  }
  
  try {
    // Kill all node processes
    execSync('taskkill /F /IM node.exe', { stdio: 'pipe' });
  } catch (error) {
    // No node processes running
  }
  
  // Kill processes on specific ports
  [...Object.values(ENFORCED_PORTS), ...FORBIDDEN_PORTS].forEach(port => {
    try {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
      if (result) {
        const lines = result.split('\\n');
        lines.forEach(line => {
          const parts = line.trim().split(/\\s+/);
          if (parts.length >= 5) {
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
              try {
                execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe' });
                logSuccess(`Killed violating process ${pid} on port ${port}`);
              } catch (error) {
                // Process might already be gone
              }
            }
          }
        });
      }
    } catch (error) {
      // Port is free
    }
  });
}

function blockWrongCommands() {
  const argv = process.argv.join(' ');
  
  // Check for forbidden command patterns
  const forbiddenPatterns = [
    /--urls.*localhost:(?!5001)/,
    /PORT=(?!3000)/,
    /--port.*(?!3000)/,
    /-p.*(?!3000)/,
    /localhost:3100/,
    /localhost:5101/,
    /localhost:4173/,
    /localhost:5173/
  ];
  
  forbiddenPatterns.forEach(pattern => {
    if (pattern.test(argv)) {
      logError('FORBIDDEN COMMAND DETECTED!');
      logError('You are attempting to use wrong ports!');
      logError('ONLY use: node .claude/scripts/start-development-servers.js');
      process.exit(1);
    }
  });
}

function main() {
  console.log('🔒 Port Validation Hook - Enforcing Port Compliance');
  console.log('==================================================');
  
  // Block wrong command patterns
  blockWrongCommands();
  
  // Validate configuration files
  if (!validateConfigPorts()) {
    logError('Configuration validation failed - fix config files first');
    process.exit(1);
  }
  
  // Kill all violating processes
  killViolatingProcesses();
  
  // Wait for processes to terminate
  setTimeout(() => {
    // Final check - ensure no port violations
    if (!checkForbiddenPorts()) {
      logError('Port violations still exist after cleanup!');
      logError('Manual intervention required - kill all processes and restart');
      process.exit(1);
    }
    
    logSuccess(`All ports validated - API:${ENFORCED_PORTS.API}, Frontend:${ENFORCED_PORTS.FRONTEND}`);
    logSuccess('Use ONLY: node .claude/scripts/start-development-servers.js');
  }, 2000);
}

// Run validation
main();