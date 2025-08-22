# Claude Model Switcher

This setup allows you to easily switch between Claude Sonnet 4 and GLM-4.5 Air for your UrbanAI project.

## Overview

- **GLM-4.5 Air**: Free model via OpenRouter (default)
- **Claude Sonnet 4**: Paid model with advanced reasoning capabilities

## Configuration Files

- `.claude/settings.local.json` - Active configuration (symlink)
- `.claude/settings-glm45.json` - GLM-4.5 Air configuration
- `.claude/settings-sonnet4.json` - Claude Sonnet 4 configuration

## Usage

### Switching Between Models

```powershell
# Switch to GLM-4.5 Air (free - recommended for most tasks)
.\scripts\switch-claude-model.ps1 glm45

# Switch to Claude Sonnet 4 (when you need advanced reasoning)
.\scripts\switch-claude-model.ps1 sonnet4
```

### Manual Configuration

You can also manually switch by:

1. Backup current settings: `cp .claude/settings.local.json .claude/settings.backup.json`
2. Copy desired configuration: `cp .claude/settings-glm45.json .claude/settings.local.json`
3. Or for Sonnet 4: `cp .claude/settings-sonnet4.json .claude/settings.local.json`

## Setup Instructions

### For GLM-4.5 Air (OpenRouter)

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Get your API key from the dashboard
3. Update `.claude/settings.local.json` with your API key:
   ```json
   "api_key": "your-openrouter-api-key-here"
   ```

### For Claude Sonnet 4

1. The configuration is already set up to use Claude Sonnet 4
2. Make sure you have the necessary API access

## Model Comparison

| Feature | GLM-4.5 Air | Claude Sonnet 4 |
|---------|-------------|-----------------|
| Cost | Free | Paid |
| Performance | Good for most tasks | Excellent for complex reasoning |
| Speed | Fast | Fast |
| Context | Good | Excellent |

## Recommendations

- **Use GLM-4.5 Air** for:
  - Most development tasks
  - Code generation and review
  - Documentation writing
  - General programming assistance

- **Use Claude Sonnet 4** for:
  - Complex architectural decisions
  - Advanced problem-solving
  - When GLM-4.5 Air struggles with a task
  - Projects requiring deep reasoning

## Troubleshooting

### Script Not Working

1. Make sure you're in the project root directory
2. Ensure the script has execution permissions:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
3. Check that all configuration files exist

### API Key Issues

1. Verify your OpenRouter API key is correct
2. Ensure you have sufficient API quota
3. Check network connectivity

### Model Not Available

1. Verify you have access to the selected model
2. Check your API key permissions
3. Try switching to the other model as a test

## Hooks and Permissions

Both configurations preserve the same hooks and permissions:
- CI status checking
- Git monitoring
- Frontend validation
- All development permissions

## Tips

1. **Start with GLM-4.5 Air** - It's free and works well for most tasks
2. **Switch to Sonnet 4** when you hit limitations with GLM-4.5 Air
3. **Test both models** on your specific use cases
4. **Keep API keys secure** - Don't commit them to version control

## Contributing

If you need to modify the configurations:
1. Edit the appropriate settings file
2. Test the changes with the switcher script
3. Update this documentation if needed
