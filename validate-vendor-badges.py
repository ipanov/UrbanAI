#!/usr/bin/env python3
"""
Visual validation script for vendor badges and feature icons update
Uses Playwright for cross-browser, multi-viewport testing
"""
import asyncio
import sys
from playwright.async_api import async_playwright
from pathlib import Path

async def capture_landing_page_validation():
    """Capture landing page screenshots with updated assets for validation"""

    async with async_playwright() as p:
        # Launch browsers for cross-browser validation
        browsers = {
            'chromium': await p.chromium.launch(headless=True),
            'firefox': await p.firefox.launch(headless=True),
        }

        # Define viewports for responsive testing
        viewports = {
            'desktop': {'width': 1920, 'height': 1080},
            'tablet': {'width': 768, 'height': 1024},
            'mobile': {'width': 375, 'height': 667}
        }

        base_url = "http://localhost:8080"
        screenshots_dir = Path("D:/Repos/UrbanAI/validation-screenshots/vendor-badges-update")
        screenshots_dir.mkdir(parents=True, exist_ok=True)

        try:
            for browser_name, browser in browsers.items():
                context = await browser.new_context()
                page = await context.new_page()

                # Navigate to landing page
                await page.goto(f"{base_url}/index.html", wait_until="networkidle")

                for viewport_name, dimensions in viewports.items():
                    # Set viewport
                    await page.set_viewport_size({"width": dimensions['width'], "height": dimensions['height']})

                    # Wait for images to load
                    await page.wait_for_load_state("networkidle")
                    await asyncio.sleep(1)  # Extra time for image rendering

                    # Capture full page screenshot
                    screenshot_path = screenshots_dir / f"landing-{browser_name}-{viewport_name}-full.png"
                    await page.screenshot(
                        path=str(screenshot_path),
                        full_page=True
                    )
                    print(f"✅ Captured: {screenshot_path.name}")

                    # Capture hero section with new badges
                    hero_element = page.locator(".hero").first
                    if await hero_element.is_visible():
                        hero_path = screenshots_dir / f"hero-badges-{browser_name}-{viewport_name}.png"
                        await hero_element.screenshot(path=str(hero_path))
                        print(f"✅ Captured: {hero_path.name}")

                    # Capture features section with new icons
                    features_element = page.locator(".features").first
                    if await features_element.is_visible():
                        features_path = screenshots_dir / f"features-icons-{browser_name}-{viewport_name}.png"
                        await features_element.screenshot(path=str(features_path))
                        print(f"✅ Captured: {features_path.name}")

                    # Capture footer with new social icons
                    footer_element = page.locator(".footer").first
                    if await footer_element.is_visible():
                        footer_path = screenshots_dir / f"footer-social-{browser_name}-{viewport_name}.png"
                        await footer_element.screenshot(path=str(footer_path))
                        print(f"✅ Captured: {footer_path.name}")

                await context.close()

            # Asset validation using Chromium
            browser = browsers['chromium']
            context = await browser.new_context()
            page = await context.new_page()

            await page.goto(f"{base_url}/index.html", wait_until="networkidle")
            await page.set_viewport_size({"width": 1920, "height": 1080})

            # Check if new assets loaded properly
            print("\n🔍 Validating Asset Loading:")

            # Check App Store badge
            app_store_badge = page.locator('img[alt="Download on the App Store"]').first
            if await app_store_badge.is_visible():
                print("✅ App Store badge loaded successfully")
            else:
                print("❌ App Store badge failed to load")

            # Check Google Play badge
            google_play_badge = page.locator('img[alt="Get it on Google Play"]').first
            if await google_play_badge.is_visible():
                print("✅ Google Play badge loaded successfully")
            else:
                print("❌ Google Play badge failed to load")

            # Check feature icons
            privacy_icon = page.locator('img[alt="Privacy Shield"]').first
            municipal_icon = page.locator('img[alt="Municipal Building"]').first
            verification_icon = page.locator('img[alt="Verification Badge"]').first

            if await privacy_icon.is_visible():
                print("✅ Privacy shield icon loaded successfully")
            else:
                print("❌ Privacy shield icon failed to load")

            if await municipal_icon.is_visible():
                print("✅ Municipal building icon loaded successfully")
            else:
                print("❌ Municipal building icon failed to load")

            if await verification_icon.is_visible():
                print("✅ Verification badge icon loaded successfully")
            else:
                print("❌ Verification badge icon failed to load")

            # Check social icons
            x_icon = page.locator('img[alt="X (Twitter)"]').first
            linkedin_icon = page.locator('img[alt="LinkedIn"]').first
            github_icon = page.locator('img[alt="GitHub"]').first

            if await x_icon.is_visible():
                print("✅ X (Twitter) icon loaded successfully")
            else:
                print("❌ X (Twitter) icon failed to load")

            if await linkedin_icon.is_visible():
                print("✅ LinkedIn icon loaded successfully")
            else:
                print("❌ LinkedIn icon failed to load")

            if await github_icon.is_visible():
                print("✅ GitHub icon loaded successfully")
            else:
                print("❌ GitHub icon failed to load")

            await context.close()

        finally:
            for browser in browsers.values():
                await browser.close()

        print(f"\n📸 Screenshots saved to: {screenshots_dir}")
        print("\n🎯 Validation Complete!")
        return str(screenshots_dir)

if __name__ == "__main__":
    try:
        result = asyncio.run(capture_landing_page_validation())
        print(f"\nValidation results saved to: {result}")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Validation failed: {e}")
        sys.exit(1)