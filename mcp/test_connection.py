"""
UrbanAI Wiki Connection Tester
This script tests the connection to Azure DevOps and lists 
available wikis and templates.
"""

import os
import sys
import json
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    print("dotenv package not found. Installing...")
    from subprocess import check_call
    check_call([sys.executable, "-m", "pip", "install", "python-dotenv"])
    from dotenv import load_dotenv

try:
    import requests
except ImportError:
    print("requests package not found. Installing...")
    from subprocess import check_call
    check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests

# Import our template processor functionality
from template_processor import (
    test_connection, get_wikis, get_wiki_pages,
    get_available_templates, process_template
)

def main():
    """Main function"""
    # Load environment variables
    load_dotenv()
    
    print("==== UrbanAI Wiki Connection Tester ====")
    
    # Test connection to Azure DevOps
    print("\n1. Testing connection to Azure DevOps...")
    connection_result = test_connection()
    print(json.dumps(connection_result, indent=2))
    
    if connection_result.get("status") != "success":
        print("Error connecting to Azure DevOps. Please check your credentials.")
        sys.exit(1)
    
    # Get available wikis
    print("\n2. Available wikis:")
    wikis = get_wikis()
    if wikis:
        for i, wiki in enumerate(wikis, 1):
            print(f"  {i}. {wiki['name']} (ID: {wiki['id']})")
    else:
        print("  No wikis found or access denied.")
    
    # Get available templates
    print("\n3. Available wiki templates:")
    templates = get_available_templates()
    if templates:
        for i, template in enumerate(templates, 1):
            print(f"  {i}. {template}")
    else:
        print("  No templates found.")
    
    # If we have wikis, get wiki pages for the first wiki
    if wikis:
        first_wiki = wikis[0]
        print(f"\n4. Pages in the first wiki ({first_wiki['name']}):")
        try:
            pages = get_wiki_pages(wiki_id=first_wiki['id'])
            if pages:
                print(json.dumps(pages, indent=2))
            else:
                print("  No pages found or access denied.")
        except Exception as e:
            print(f"  Error getting wiki pages: {e}")
    
    print("\n==== Test Complete ====")

def write_to_log(message):
    """Write message to log file"""
    with open("connection_test_log.txt", "a") as f:
        f.write(f"{message}\n")

if __name__ == "__main__":
    # Capture stdout to a file as well
    import sys
    from io import StringIO
    
    # Save original stdout
    original_stdout = sys.stdout
    
    # Create a StringIO object to capture output
    string_io = StringIO()
    sys.stdout = string_io
    
    try:
        main()
    finally:
        # Restore original stdout
        sys.stdout = original_stdout
        
        # Get the captured output
        output = string_io.getvalue()
        
        # Print to console
        print(output)
        
        # Write to log file
        with open("connection_test_log.txt", "w") as f:
            f.write(output)
