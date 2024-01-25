# 4chan propaganda script
This Python script automates the process of posting content to specific threads on 4chan. It uses the DrissionPage package to control a Chromium browser, navigates to the 4chan threads, injects custom scripts, handles captchas, and posts content.

## Functionality
- Automated Navigation: The script navigates to specified 4chan threads.
- Script Injection: Injects TensorFlow.js and a custom captcha solver script into the 4chan pages.
- Captcha Handling: Manages captcha interaction automatically, *including Cloudflare*.
- Content Posting: Automatically posts content to the threads.

## Setup
1. Install python3

`brew update && brew install python3 && python3 --version`

2. Install python dependency: DrissionPage

`pip install DrissionPage`

3. (Optional) Set up Chromium

You can download it from Google Chrome's website and follow the installation instructions.

## Running the propaganda script
`python3 script_name.py '[{"text": "Example text for post", "thread_id": "123456789"}, {"text": "Another example text", "thread_id": "987654321"}]'`


