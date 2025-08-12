# AI Assistant Personas for Cline

This directory contains markdown files defining various AI Assistant personas for Cline. These personas are designed to guide Cline's behavior, thought processes, and tool prioritization when performing tasks related to specific software development roles.

## How Personas Work (Conceptual)

When a persona is activated, its content is intended to be dynamically injected as a prefix to Cline's internal prompt. This "primes" Cline to adopt the mindset, principles, and methodologies of the chosen role for subsequent interactions.

## Available Personas

*   **UX Designer:** `cline-ux-designer-persona.md`
    *   Focus: User-centered design, visual harmony, accessibility, Figma interaction.
    *   Relevant MCP Servers: `TalkToFigma` (via "Cursor Talk To Figma MCP Plugin").
*   **DevOps Engineer:** `cline-devops-engineer-persona.md`
    *   Focus: Automation, reliability, efficiency, infrastructure as code, CI/CD.
    *   Relevant MCP Servers: `github.com/Azure/azure-mcp` (if available and configured).
*   **QA Engineer:** `cline-qa-engineer-persona.md`
    *   Focus: Quality, thoroughness, user advocacy, automated and manual testing.
    *   Relevant MCP Servers: (To be identified based on specific testing tools/platforms).
*   **Backend Developer:** `cline-backend-developer-persona.md`
    *   Focus: Robustness, scalability, security, API design, database interactions.
    *   Relevant MCP Servers: (To be identified based on specific database or API management tools).
*   **Frontend Developer:** `cline-frontend-developer-persona.md`
    *   Focus: Usability, responsiveness, performance, UI implementation, component-based development.
    *   Relevant MCP Servers: `github.com/GLips/Figma-Context-MCP` (if available and configured).
*   **Project Manager:** `cline-project-manager-persona.md`
    *   Focus: Organization, communication, delivery, risk management, task coordination.
    *   Relevant MCP Servers: `github.com/Azure/azure-devops-mcp` (if available for task management integration), `urban_ai_wiki_mcp` (for documentation).
*   **Cybersecurity Engineer:** `cline-cybersecurity-engineer-persona.md`
    *   Focus: Proactive defense, risk mitigation, continuous improvement, vulnerability assessment.
    *   Relevant MCP Servers: (To be identified based on specific security tools or threat intelligence platforms).

## Activating a Persona (Conceptual)

The activation mechanism would typically involve a command or a configuration setting within Cline's core application. For example:

*   **Command-line activation:** `/set_persona devops`
*   **Configuration file:** A setting like `active_persona: "devops"` in Cline's configuration.

Upon activation, Cline would:
1.  Read the content of the specified persona markdown file.
2.  Prepend this content to its internal prompt for relevant interactions.
3.  Identify and (conceptually) load or prioritize the MCP servers listed in the persona's "Relevant MCP Servers" section.

## Testing Personas (Conceptual)

Testing would involve:
1.  Verifying that activating a persona changes Cline's conversational style and approach.
2.  Confirming that Cline attempts to use or prioritize tools/MCPs relevant to the active persona.
3.  Providing tasks that specifically require the expertise of a given persona and observing Cline's problem-solving methodology.

**Note:** The actual implementation of persona loading, prompt injection, and dynamic MCP server management would require modifications to Cline's core application logic, which is beyond the scope of direct file manipulation by this AI assistant. This documentation serves as a blueprint for such an implementation.
