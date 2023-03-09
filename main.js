const CDP = require('chrome-remote-interface');
const minimist = require('minimist');


function parseArguments() {
    const arguments = minimist(process.argv.slice(2), {boolean: true});

    // check for unknown parameters
    const knownParameters = ['_', 'help', 'port', 'urlPattern', 'singleResult']
    for (const argKey of Object.keys(arguments)) {
        if (!knownParameters.some(parameter => parameter === argKey)) {
            console.log(`parameter ${argKey} is not known. --help to show parameters.`);
            process.exit();
        }
    }

    // set default parameters
    if (arguments.help === undefined) {
        arguments.help = false
    }
    if (arguments.port === undefined) {
        arguments.port = '9222'
    }
    if (arguments.urlPattern === undefined) {
        arguments.urlPattern = '*'
    }
    if (arguments.singleResult === undefined) {
        arguments.singleResult = false
    }

    // --help
    if (arguments.help === true) {
        console.log(
            `\n`,
            `adb_network_interceptor\n`,
            `This tool is for network interception of chrome on android.\n`,
            `\n`,
            `parameters\n`,
            `--help --port --urlPattern --singleResult\n`,
            `\n`,
            `--port\n`,
            `This is a string value of the port number you wish to connect.\n`,
            `How to connect chrome\n`,
            `google-chrome --remote-debugging-port=9222\n`,
            `How to connect android\n`,
            `adb forward tcp:9222 localabstract:chrome_devtools_remote\n`,
            `default\n`,
            `--port=9222\n`,
            `\n`,
            `--urlPattern\n`,
            `This is a string value to specify what url requests to intercept.\n`,
            `You can add * like, --urlPattern="https://www.google.com*"\n`,
            `This will get all url requests with the prefix https://www.google.com\n`,
            `default\n`,
            `--urlPattern="*"\n`,
            `\n`,
            `--singleResult\n`,
            `If you add this parameter the program ends if a singular result is found.\n`,
            `\n`,
        )
        process.exit()
    }

    return arguments
}

async function networkIntercept(args) {
    let client;

    client = await CDP({port: args.port, local: true});
    await Promise.all([client.Page.enable(), client.Runtime.enable(), client.Network.enable()]);

    /** https://chromedevtools.github.io/devtools-protocol/tot/Network */

    client.Network.setRequestInterception({
        patterns: [{
            urlPattern: args.urlPattern,
        }]
    });

    client.Network.requestIntercepted(async ({interceptionId, request}, session) => {
        console.log(request.url)
        if (args.singleResult) {
            process.exit()
        }
        client.Network.continueInterceptedRequest({interceptionId}, session);
    });

    /** This is for iframe interception. Attaches the iframe with a different sessionId. */
    client.Target.setAutoAttach({
        autoAttach: true,
        waitForDebuggerOnStart: false,
        flatten: true
    });

    client.Target.attachedToTarget(async ({sessionId, targetInfo}) => {

        client.Network.setRequestInterception({
                patterns: [{
                    urlPattern: args.urlPattern,
                }]
            }, sessionId
        );

        client.Target.setAutoAttach({
                autoAttach: true,
                waitForDebuggerOnStart: false,
                flatten: true
            }, sessionId
        )
    });

    /** Await indefinitely */
    await new Promise(() => {
    });
}

const arguments = parseArguments();
networkIntercept(arguments);
