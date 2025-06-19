"""
UrbanAI Wiki Page Creator
This script creates a new wiki page using one of the available templates.
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
    get_wikis, create_wiki_page_from_template, get_available_templates
)

def main():
    """Main function"""
    # Load environment variables
    load_dotenv()
    
    print("==== UrbanAI Wiki Page Creator ====")
    
    # Get available wikis
    wikis = get_wikis()
    if not wikis:
        print("No wikis found or access denied.")
        sys.exit(1)
    
    # Use the first wiki
    wiki = wikis[0]
    wiki_id = wiki['id']
    project_name = os.getenv('AZURE_DEVOPS_DEFAULT_PROJECT', 'UrbanAI')
    
    # Get available templates
    templates = get_available_templates()
    if not templates:
        print("No templates found.")
        sys.exit(1)
    
    print(f"\nCreating a new page in wiki: {wiki['name']} (ID: {wiki_id})")
    
    # Create a new wiki page using the feature template
    template_name = "feature_template"
    page_path = "/UrbanAI_Feature_Machine_Learning_Pipeline"
    
    replacements = {
        "TITLE": "Machine Learning Pipeline",
        "OVERVIEW": "The UrbanAI Machine Learning Pipeline is a key component that processes urban data through various ML models to extract insights.",
        "PURPOSE": "To provide a scalable, flexible pipeline for training, evaluating, and deploying machine learning models on urban data sources.",
        "TECHNICAL_IMPLEMENTATION": "The pipeline is implemented using TensorFlow for model training, MLflow for experiment tracking, and Docker for containerization. It supports both batch processing and streaming data inputs.",
        "RELATED_COMPONENTS": "- Data Ingestion Service\n- Feature Store\n- Model Registry\n- Inference API",
        "DATE": "June 12, 2025"
    }
    
    comment = "Added Machine Learning Pipeline documentation"
    
    print(f"\nCreating page at path: {page_path}")
    print(f"Using template: {template_name}")
    print(f"With replacements: {json.dumps(replacements, indent=2)}")
    
    result = create_wiki_page_from_template(
        project_name,
        wiki_id,
        page_path,
        template_name,
        replacements,
        comment
    )
    
    # Write the result to a file for debugging
    with open("create_page_result.json", "w") as f:
        json.dump(result, f, indent=2)
    
    if result.get("status") == "success":
        print("\n✅ Wiki page created successfully!")
        if "result" in result and "remoteUrl" in result["result"]:
            print(f"View the page at: {result['result']['remoteUrl']}")
    else:
        print("\n❌ Failed to create wiki page.")
        print(f"Error details: {json.dumps(result, indent=2)}")
    
    print("\n==== Wiki Page Creation Complete ====")

if __name__ == "__main__":
    main()
