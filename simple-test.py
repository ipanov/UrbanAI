#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def simple_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto("http://localhost:8080/", wait_until="networkidle")

        # Wait for user to see
        await asyncio.sleep(5)

        # Check if page loaded
        title = await page.title()
        print(f"Page title: {title}")

        # Check if new badges exist
        badges = await page.locator('img[alt="Download on the App Store"]').count()
        print(f"App Store badges found: {badges}")

        await browser.close()

asyncio.run(simple_test())