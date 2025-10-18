#!/usr/bin/env python3
"""
Script to fetch data from a URL and display it.
"""

import requests
import json
from urllib.parse import urlparse

def fetch_url_data(url):
    """
    Fetch data from the given URL and return the response.
    """
    try:
        print(f"Fetching data from: {url}")
        print("-" * 50)
        
        # Make the request
        response = requests.get(url, timeout=30)
        
        # Print response details
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'Unknown')}")
        print(f"Content-Length: {len(response.content)} bytes")
        print("-" * 50)
        
        # Try to parse as JSON first
        try:
            json_data = response.json()
            print("Response (JSON):")
            print(json.dumps(json_data, indent=2))
        except json.JSONDecodeError:
            # If not JSON, display as text
            print("Response (Text):")
            print(response.text)
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    url = "https://f4f1baf2-ee26-4b44-8025-bc335cd2d94c-00-el0o7oc1ra0u.picard.replit.dev/"
    fetch_url_data(url)