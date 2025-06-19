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
        # Scrape the page - try simple approach first
        scrape_result = app.scrape_url(url)
        
        if scrape_result:
            print("Successfully crawled content!")
            print("=" * 80)
            
            # Try to get markdown content
            if 'markdown' in scrape_result:
                content = scrape_result['markdown']
                print("MARKDOWN CONTENT:")
                print(content)
            elif 'content' in scrape_result:
                content = scrape_result['content']
                print("HTML CONTENT:")
                print(content)
            else:
                print("FULL RESPONSE:")
                print(scrape_result)
                content = str(scrape_result)
            
            print("=" * 80)
            
            # Save to file for reference
            with open('chatgpt_urbanai_conversation.md', 'w', encoding='utf-8') as f:
                f.write(content)
            print("Content saved to chatgpt_urbanai_conversation.md")
            
        else:
            print("Failed to extract content - empty response")
            
    except Exception as e:
        print(f"Error crawling: {e}")
        # Try alternative approach
        try:
            print("Trying alternative scraping approach...")
            scrape_result = app.scrape_url(url, {"formats": ["markdown", "html"]})
            print("Alternative result:", scrape_result)
        except Exception as e2:
            print(f"Alternative approach also failed: {e2}")

if __name__ == "__main__":
    crawl_chatgpt_conversation()
