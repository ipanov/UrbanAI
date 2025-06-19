print("Testing Python execution...")

import os
print(f"Current directory: {os.getcwd()}")

import requests
print("Requests module loaded")

from dotenv import load_dotenv
print("python-dotenv loaded")

load_dotenv()
print("Environment variables loaded")

# Print some environment variables
print(f"PAT exists: {bool(os.getenv('AZURE_DEVOPS_PAT'))}")
print(f"Organization URL exists: {bool(os.getenv('AZURE_DEVOPS_ORGANIZATION_URL'))}")
print(f"Project exists: {bool(os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT'))}")
