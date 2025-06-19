"""Script to crawl the ChatGPT conversation and extract UrbanAI project description."""

import os
from firecrawl import FirecrawlApp

def crawl_chatgpt_conversation():
    """Crawl the ChatGPT conversation to get UrbanAI project description."""
    
    # Initialize Firecrawl with API key
    api_key = "fc-66e8214797294e32be7dd923b60a6b80"
    app = FirecrawlApp(api_key=api_key)
    
    # URL to crawl
    url = "https://chatgpt.com/share/684afd0d-e658-8008-bf2c-c9d1fcb5c382"
      print(f"Crawling ChatGPT conversation: {url}")
    
    try:
        # Scrape the page
        scrape_result = app.scrape_url(url, {
            'formats': ['markdown'],
            'onlyMainContent': True,
            'includeTags': ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'ul', 'ol'],
            'timeout': 30000
        })
        
        if scrape_result and 'markdown' in scrape_result:
            content = scrape_result['markdown']
            print("Successfully crawled content!")
            print("=" * 80)
            print(content)
            print("=" * 80)
            
            # Save to file for reference
            with open('chatgpt_urbanai_conversation.md', 'w', encoding='utf-8') as f:
                f.write(content)
            print("Content saved to chatgpt_urbanai_conversation.md")
            
        else:
            print("Failed to extract content")
            print("Response:", scrape_result)
            
    except Exception as e:
        print(f"Error crawling: {e}")

if __name__ == "__main__":
    crawl_chatgpt_conversation()
