"""Simple script to scrape ChatGPT conversation content."""

import requests
from bs4 import BeautifulSoup
import re

def scrape_chatgpt_conversation(url):
    """Scrape the ChatGPT conversation."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Try to find the conversation content
        # ChatGPT shared conversations usually have the content in specific divs
        
        # Look for text content that mentions UrbanAI
        text_content = soup.get_text()
        
        # Search for UrbanAI related content
        urbanai_sections = []
        lines = text_content.split('\n')
        
        for i, line in enumerate(lines):
            if 'UrbanAI' in line or 'urban' in line.lower():
                # Get surrounding context
                start = max(0, i - 5)
                end = min(len(lines), i + 10)
                context = '\n'.join(lines[start:end])
                urbanai_sections.append(context)
        
        return urbanai_sections
        
    except Exception as e:
        print(f"Error scraping: {e}")
        return []

if __name__ == "__main__":
    url = "https://chatgpt.com/share/684afd0d-e658-8008-bf2c-c9d1fcb5c382"
    sections = scrape_chatgpt_conversation(url)
    
    if sections:
        print("Found UrbanAI related content:")
        for i, section in enumerate(sections, 1):
            print(f"\n--- Section {i} ---")
            print(section)
    else:
        print("No UrbanAI content found or unable to scrape")
