"""
UrbanAI Wiki Management Server
This script provides a simple HTTP server that exposes the 
Azure DevOps Wiki management functionality.
"""

import os
import sys
import json
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler

# Add auto-install functionality for dependencies
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
    create_wiki_page, create_wiki_page_from_template,
    delete_wiki_page, get_available_templates, process_template
)

# Load environment variables
load_dotenv()

class WikiHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type='application/json'):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.end_headers()
    
    def _send_json_response(self, data):
        self.wfile.write(json.dumps(data).encode())
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/':
            self._set_headers()
            self._send_json_response({"status": "UrbanAI Wiki Management Server is running"})
        elif self.path == '/api/heartbeat':
            self._set_headers()
            self._send_json_response({"status": "alive"})
        elif self.path == '/api/test-connection':
            self._set_headers()
            result = test_connection()
            self._send_json_response(result)
        elif self.path == '/api/templates':
            self._set_headers()
            templates = get_available_templates()
            self._send_json_response({"templates": templates})
        elif self.path == '/api/wikis':
            self._set_headers()
            wikis = get_wikis()
            self._send_json_response({"wikis": wikis})
        else:
            self.send_response(404)
            self.end_headers()
            self._send_json_response({"error": "Not found"})
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(post_data)
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            self._send_json_response({"error": "Invalid JSON"})
            return
        
        if self.path == '/api/create-wiki-page':
            required_fields = ['project_name', 'wiki_id', 'path', 'content']
            if not all(field in data for field in required_fields):
                self.send_response(400)
                self.end_headers()
                self._send_json_response({"error": "Missing required fields", "required": required_fields})
                return
            
            result = create_wiki_page(
                data['project_name'], 
                data['wiki_id'], 
                data['path'], 
                data['content'],
                data.get('comment')
            )
            
            self._set_headers()
            self._send_json_response({"result": result})
        
        elif self.path == '/api/create-from-template':
            required_fields = ['project_name', 'wiki_id', 'path', 'template_name', 'replacements']
            if not all(field in data for field in required_fields):
                self.send_response(400)
                self.end_headers()
                self._send_json_response({"error": "Missing required fields", "required": required_fields})
                return
            
            result = create_wiki_page_from_template(
                data['project_name'], 
                data['wiki_id'], 
                data['path'], 
                data['template_name'], 
                data['replacements'],
                data.get('comment')
            )
            
            self._set_headers()
            self._send_json_response({"result": result})
        
        elif self.path == '/api/delete-wiki-page':
            required_fields = ['project_name', 'wiki_id', 'path']
            if not all(field in data for field in required_fields):
                self.send_response(400)
                self.end_headers()
                self._send_json_response({"error": "Missing required fields", "required": required_fields})
                return
            
            result = delete_wiki_page(
                data['project_name'], 
                data['wiki_id'], 
                data['path'],
                data.get('comment')
            )
            
            self._set_headers()
            self._send_json_response({"result": result})
            
        else:
            self.send_response(404)
            self.end_headers()
            self._send_json_response({"error": "Not found"})

def run_server(port=7001):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, WikiHandler)
    print(f"Starting UrbanAI Wiki Management Server on port {port}")
    
    # Test connection before starting server
    print("Testing connection to Azure DevOps...")
    connection_status = test_connection()
    print(json.dumps(connection_status, indent=2))
    
    if connection_status.get("status") != "success":
        print("Error connecting to Azure DevOps. Please check your credentials.")
        sys.exit(1)
    
    print(f"Server is ready at http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
