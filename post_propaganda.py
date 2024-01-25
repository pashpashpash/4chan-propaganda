import json
import sys
from time import sleep
from DrissionPage import MixPage, ChromiumPage, ChromiumOptions


def wait_to_click_captcha_button(page, max_wait_time=30):
    wait_interval = 0.5  # seconds to wait between checks
    elapsed_time = 0
    print("Waiting for button to be enabled...")
    while elapsed_time < max_wait_time:
        # Locate the button using its selector
        load_btn = page.ele('css:#t-load')
        if not load_btn:
            print("Button not found on the page.")
            break


        # Use the .attr method to retrieve the value of the 'disabled' attribute
        disabled_attr = load_btn.attr('disabled')

        # Check if the 'disabled' attribute is not present (button is enabled)
        if disabled_attr is None:
            print("The button is now enabled.")
            # Perform actions like clicking the button
            load_btn.click()
            break
        else:
            # Wait for a short period before trying again
            sleep(wait_interval)
            elapsed_time += wait_interval

    if elapsed_time >= max_wait_time:
        print("The button did not become enabled within the time limit.")
        page.quit()
        exit(1)

def post_propaganda(posts):
    options = ChromiumOptions()
    # arguments = [
    #     "-no-first-run",
    #     "-force-color-profile=srgb",
    #     "-metrics-recording-only",
    #     "-password-store=basic",
    #     "-use-mock-keychain",
    #     "-export-tagged-pdf",
    #     "-no-default-browser-check",
    #     "-disable-background-mode",
    #     "-enable-features=NetworkService,NetworkServiceInProcess,LoadCryptoTokenExtension,PermuteTLSExtensions",
    #     "-disable-features=FlashDeprecationWarning,EnablePasswordsAccountStorage",
    #     "-deny-permission-prompts",
    #     "-disable-gpu",
    #     "-headless",
    #     "-incognito",
    #     # "-user-data-dir=D:\\System\\Desktop\\Undetected\\Drission_Dennis\\tmp\\"
    # ]


    # options.set_argument("--headless")
    # options.set_argument("--incognito")
    options.set_argument("--ignore-gpu-blacklist")
    options.set_argument("--disable-gpu-blacklist")
    options.set_argument("--use-gl=desktop")
    options.set_argument("--enable-webgl")
    options.set_argument('--enable-accelerated-2d-canvas')
    options.set_argument('--enable-gpu-rasterization')
    options.set_argument('--disable-software-rasterizer')
    options.set_argument('--enable-3d-apis')
    options.set_argument('--enable-3d-apis')
    options.set_argument('-use-gl=angle')
    options.set_argument('--use-angle=swiftshader-webgl')
    options.set_argument('--disable-ws')
    options.set_argument('--screenshot')

    try:
        print("Initializing ChromiumPage...")
        page = ChromiumPage(addr_driver_opts=options)
        print("ChromiumPage initialized successfully.")
    except Exception as e:
        print(f"Error initializing ChromiumPage: {e}")
        exit(1)


    # Read your script content
    # content.bundle.js | 4chan-script.js
    with open('propaganda/4chan-script.js', 'r') as file:
        script_content = file.read()
    escaped_script_content = json.dumps(script_content) 

    for post in posts:
        keepGoing = False
        while keepGoing == False:
            thread_url = f"https://boards.4chan.org/biz/thread/{post['thread_id']}"

            print("Going to page: " + thread_url)

            # Use Drission to navigate to the URL

            page.get(thread_url, 2, 1)

            # Inject custom script
            body = page.ele('body')

            print("Injecting TensorFlow.js")
            response = page.run_js("""console.log('Injecting TensorFlow.js');
            var script1 = document.createElement('script');
            script1.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.js';
            document.body.appendChild(script1);
            """)

            sleep(2)

            print("Injecting TensorFlow.js WASM Backend")
            response = page.run_js("""
            console.log('Injecting TensorFlow.js WASM Backend');
            var script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.10.0/dist/tf-backend-wasm.js';
            document.body.appendChild(script2);
            """)

            sleep(2)

            print("Injecting 4chan captcha solver script")
            response = page.run_js(f'''
                var script = document.createElement('script');
                script.textContent = {escaped_script_content};
                document.body.appendChild(script);
            ''', as_expr=True)

            print("Waiting for form to be visible and interactable")
            form = page.ele('css:form[name="post"]')

            print("Clicking to open the reply box")
            reply_link = page.ele('css:#togglePostFormLink a')
            reply_link.click()

            print("Waiting for textarea to be visible and interactable")
            textarea = form.ele('css:textarea[name="com"]')
            textarea.input(post['text'])

            sleep(2)

            print("Clicking to get the captcha")
            wait_to_click_captcha_button(page)


            print("Checking if we need to wait to get captcha...")
            if page.ele('You have to wait a while before doing this again'):
                load_btn = form.ele('css:#t-load')
                try:
                    time_remaining = int(load_btn.inner_html)
                    print(f"We must wait {time_remaining}s to request captcha again...")
                    wait_to_click_captcha_button(page, time_remaining+2)
                except:
                    print("No time remaining found")
        
            sleep(3)
            
            print("Waiting for the cloudflare checkbox to be visible and interactable")

            # iframe = page.get_frame('@src^https://challenges.cloudflare.com')
            firstframe = page.get_frame('@src^https://sys.4chan.org/captcha')
            try:
                iframe = firstframe('xpath://iframe')
                
                if iframe:
                    print("Found cloudflare iframe")
                    sleep (3)
                    cloudflareCheckbox = iframe('.mark')
                    if cloudflareCheckbox:
                        print("Found cloudflare checkbox")
                        cloudflareCheckbox.click()
                    else:
                        print("No cloudflare checkbox found")
                else:
                    print("No cloudflare iframe found")
            except:
                print("No cloudflare iframe found")


            print("Checking if we need to wait to get captcha...")
            if page.ele('You have to wait a while before doing this again'):
                load_btn = form.ele('css:#t-load')
                try:
                    time_remaining = int(load_btn.inner_html)
                    print(f"We must wait {time_remaining}s to request captcha again...")
                    wait_to_click_captcha_button(page, time_remaining+2)
                except:
                    print("No time remaining found")

            sleep(3)
            
            print("Waiting for the 4chan captcha to be ready")

            print("Waiting for form button to be visible and interactable")
            submit_btn = form.ele('css:input[type="submit"][value="Post"]')
            print("Submitting the form")
            submit_btn.click()

            print("Waiting for the post to be submitted")
            error = page('#errmsg')
            if error:
                # restart from beginning if there's an error
                print("Error submitting post: " + error.inner_html)
            else: 
                print(f"Post submitted for thread {post['thread_id']}")
                sleep(25)
                keepGoing = True



    # Close Drission
    page.quit()
    exit(0)
    
if __name__ == "__main__":
    # Check if an argument is provided

    posts = None
    if len(sys.argv) != 2:
        posts = [
        {
            "text": ">>57201344\nicp is goated, kill yourself",
            "quoted_post_id": 57201344,
            "quote_text": "Didn't read lol",
            "thread_id": 57201261,
        }]
    else: 
        # Parse the JSON argument
        posts_json = sys.argv[1]
        try:
            posts = json.loads(posts_json)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {e}")
            sys.exit(1)

    post_propaganda(posts)
