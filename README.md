# chromeNetworkInterceptor
Network interception tool for chrome and android device bridge.   

## What is this?
This is a shell tool made with node.js.   
The tool is for network interception on chrome.   
You can use this with android chrome, or local chrome.   

## How to use
The executables are located in `./executables`   

Run the program is shell with or without the following parameters.   
`--port --urlPattern --singleResult`

### Running with local chrome  
1. Find out where chrome is located.   
2. Port forward your debugging port of chrome to port 9222.   
`/location/to/google-chrome --remote-debugging-port=9222`   
3. Run the tool with the same port number.   
`adb_network_interceptor-macos --port="9222"`

### Running with android   
1. Install the latest version of adb.   
2. Connect by usb and check if your device is connected.   
`adb devices`   
3. Port forward your device chrome to port 9222.   
`adb forward tcp:9222 localabstract:chrome_devtools_remote`   
4. Run tool with the same port number.   
`adb_network_interceptor-macos --port="9222"`

All urls can be divided with \n.   

If you want to add more features like intercepting body, headers, or any other information?

Feel free to contribute and ask for a PR. XD

### --help
```
adb_network_interceptor
 This tool is for network interception of chrome on android.
 
 parameters
 --help --port --urlPattern --singleResult
 
 --port
 This is a string value of the port number you wish to connect.
 How to connect chrome
 google-chrome --remote-debugging-port=9222
 How to connect android
 adb forward tcp:9222 localabstract:chrome_devtools_remote
 default
 --port=9222
 
 --urlPattern
 This is a string value to specify what url requests to intercept.
 You can add * like, --urlPattern="https://www.google.com*"
 This will get all url requests with the prefix https://www.google.com
 default
 --urlPattern="*"
 
 --singleResult
 If you add this parameter the program ends if a singular result is found.
```

## References   
* chrome devtools protocol
  * https://chromedevtools.github.io/devtools-protocol/tot/Network
* iframe network interception
  * https://stackoverflow.com/questions/44796024/chrome-devtools-protocol-switch-active-frame
  * https://stackoverflow.com/questions/63357370/capture-requests-xhr-js-css-from-embedded-iframes-using-devtool-protocol
