<task_objective>
Start UrbanAI development services with proper port management and conflict resolution
</task_objective>

<detailed_sequence_of_steps>
1. **Check Port Configuration**: Read port configuration from .clinerules/config/ports.config.json
2. **Scan for Conflicts**: Check if configured ports (3000, 5001, 7071) are already in use
3. **Identify Conflicting Processes**: Use netstat and tasklist to identify processes using required ports
4. **Safe Process Termination**: For development-related processes, offer to terminate safely
5. **Port Conflict Resolution**: If conflicts persist, suggest alternative ports or manual intervention
6. **Start Frontend Service**: Launch React development server on port 3000
7. **Start Backend API**: Launch .NET API on port 5001
8. **Start Azure Functions**: Launch Functions runtime on port 7071
9. **Validate Service Health**: Check that all services are running and accessible
10. **Update Memory Bank**: Record service startup status in memory-bank/activeContext.md
11. **Provide Access URLs**: Display local development URLs for all services
</detailed_sequence_of_steps>

<port_configuration>
{
  "frontend": {
    "port": 3000,
    "service": "React Development Server",
    "url": "http://localhost:3000"
  },
  "backend": {
    "port": 5001,
    "service": ".NET API",
    "url": "https://localhost:5001"
  },
  "functions": {
    "port": 7071,
    "service": "Azure Functions",
    "url": "http://localhost:7071"
  }
}
</port_configuration>

<required_tools>
- Port scanning utilities (netstat, lsof equivalent for Windows)
- Process management tools (taskkill, tasklist)
- Service health checking (curl, wget)
- File system access for configuration reading
- Memory bank update capabilities
</required_tools>

<success_criteria>
- ✅ All required ports are available or conflicts resolved
- ✅ Frontend service running on port 3000
- ✅ Backend API running on port 5001
- ✅ Azure Functions running on port 7071
- ✅ All services accessible via configured URLs
- ✅ Service status documented in memory bank
</success_criteria>

<failure_handling>
If port conflicts cannot be resolved:
1. Identify specific conflicting processes and their owners
2. Suggest manual termination or port reconfiguration
3. Provide alternative port options with configuration updates
4. Document conflict details in memory bank for future reference
5. Offer to skip problematic services and start others
</failure_handling>
