# 4chan propaganda script
This Python script automates the process of posting content to specific threads on 4chan. It uses the DrissionPage library to control a Chromium browser, navigates to the 4chan threads, injects custom scripts, handles captchas, and posts content.

![propaganda](https://github.com/pashpashpash/4chan-propaganda/assets/20898225/08e8e931-7c69-4b0f-acce-e9f461264302)

## Functionality
- Automated Navigation: The script navigates to specified 4chan threads.
- Script Injection: Injects TensorFlow.js and a custom captcha solver script into the 4chan pages.
- Captcha Handling: Manages captcha interaction automatically, *including Cloudflare*.
- Content Posting: Automatically posts content to the threads.

## Proof that this works flawlessly
I used OpenAI to generate a bunch of posts to shill a fake token called trumpworldpalsphere on the /biz/ board. I then passed the generated posts to this script to be posted.
You can see the posts here: https://archived.moe/biz/search/text/trumpworldpalsphere

## Setup
1. Install python3

```brew update && brew install python3 && python3 --version```

2. Install python dependency: DrissionPage

```pip3 install DrissionPage```

3. (Optional) Set up latest Chromium driver and replace the one in this repo with the latest one.

You can download it from Google Chrome's website and follow the installation instructions. Alternatively, don't do anything and just use the chromium driver in the repo.

## Running the propaganda script

```python3 post-propaganda.py '[{"text": "Example text for post", "thread_id": "123456789"}, {"text": "Another example text", "thread_id": "987654321"}]'```

- Ensure the `thread_id`s are active threads that can be replied to.
- The script will go through each item in the array, one by one, solving the captchas and posting the specified `text` content. 

## Limitations
- This script only makes posts in existing threads, though you could easily modify it to create new threads.
- Uploading images isn't supported, but is possible if you can dig through the Chinese [Drission library](https://github.com/g1879/DrissionPage) on github (good luck lol) and implement the desired functionality.

## Other things to keep in mind
The 4chan slider captcha is solved using an injected [js script](https://github.com/pashpashpash/4chan-propaganda/blob/main/4chan-script.js). I got it from [drunohazarb's repo](https://github.com/drunohazarb/4chan-captcha-solver). 

4chan tends to make slight modifications to their captcha system, but [drunohazarb](https://github.com/drunohazarb) does a good job staying on top of it. 

If you have trouble with the 4chan slider captcha, I recommend downloading the latest version of the solver script (preferably the [wasm](https://github.com/drunohazarb/4chan-captcha-solver/blob/master/4chan-captcha-solver-wasm.user.js) version) and updating the 4chan-script.js with its contents. You may have to modify some small stuff to accomodate the transition from a user script to a regular injected script. If you can't figure out what I'm talking about, use ChatGPT or something
