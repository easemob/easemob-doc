# EasyIM Web Quickstart


This page describes how to quickly integrate the EasyIM Web SDK and use it to send and receive one-to-one text messages.

## Understand the tech

The following diagram shows how a client sends and receives one-to-one text messages.

![](/images/web/sendandreceivemsg.png)

## Environment setup


Create an `Easemob_quickstart` directory. In this directory, run `npm init` to create `package.json`, and then create the following files:

- `index.html`: Defines the Web app's user interface.
- `index.js`: Implements SDK initialization, login, message sending, and message receiving.

Your directory now contains the following files:

Easemob_quickstart<br>
├─ index.html<br>
├─ index.js<br>
└─ package.json

## Prerequisite

- You have a valid [EasyIM developer account](/product/console/account_register.html#注册账号).
- You have [created an app](/product/console/app_create.html) in the EasyIM Console and [obtained the App Key](/product/console/app_manage.html#管理应用).
- You have installed [npm](https://www.npmjs.com/get-npm).
- The SDK supports IE 9+, Firefox 10+, Chrome 54+, and Safari 6+.

## Implementation process

This section describes how to integrate the EasyIM Web SDK into your project.

### Step 1: Integrate the SDK

- Add `easemob-websdk` and its version to `dependencies` in `package.json`:

```json
{
    "name": "web",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "dependencies": {
        "easemob-websdk": "latest"
    },
    "author": "",
    "license": "ISC"
}
```

### Step 2: Create a user

Create a user in the [EasyIM Console](https://console.easemob.com/user/login) and obtain the user ID and user token. For details, see [Create users](/product/console/operation_user.html#创建用户).

In a production environment, to ensure security, integrate the [Get an App Token API](/document/server-side/easemob_app_token.html) and [Get a User Token API](/document/server-side/easemob_user_token.html) on your app server. The app server then issues user tokens to clients so that sensitive credentials are not exposed on the client.

### Step 3: Implement the user interface

The contents of `index.html` are as follows.

`<script src="./dist/bundle.js"></script>` references the `bundle.js` file built by webpack. Webpack configuration is described in a later step.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Easemob Chat Examples</title>
</head>

<body>
    <h2 class="left-align">Easemob Chat Examples</h2>
    <form id="loginForm">
        <div class="col" style="min-width: 433px; max-width: 443px">
            <div class="card" style="margin-top: 0px; margin-bottom: 0px;">
                <div class="row card-content" style="margin-bottom: 0px; margin-top: 10px;">
                    <div class="input-field">
                        <label>User ID</label>
                        <input type="text" placeholder="User ID" id="userID">
                    </div>
                    <div class="input-field">
                        <label>Token</label>
                        <input type="text" placeholder="Token" id="token">
                    </div>
                    <div class="row">
                        <div>
                            <button type="button" id="login">login</button>
                            <button type="button" id="logout">logout</button>
                        </div>
                    </div>
                    <div class="input-field">
                        <label>Peer user ID</label>
                        <input type="text" placeholder="Peer user ID" id="peerId">
                    </div>
                    <div class="input-field">
                        <label>Peer Message</label>
                        <input type="text" placeholder="Peer message" id="peerMessage">
                        <button type="button" id="send_peer_message">send</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <hr>
    <div id="log"></div>
</body>
<script src="./dist/bundle.js"></script>
</html>
```

### Step 4: Send and receive messages

The contents of `index.js` are as follows. This document uses `import` to import the SDK and webpack to bundle the JavaScript file. Replace `<Your app key>` in the code with the App Key obtained from the EasyIM Console.

```typescript
import { ChatClient, ChatManager } from 'easemob-websdk';

const appKey = '<Your app key>';
let userId;
let token;

const appendLog = (text) => {
    document
        .getElementById('log')
        .appendChild(document.createElement('div'))
        .append(text);
};

// Initialize the SDK and register ChatManager. For parameter configuration, see the initialization document.
const client = ChatClient.init({
    appKey,
    managers: [ChatManager],
});

// Monitor the connection state.
client.addEventHandler('connection', {
    onConnected: () => {
        appendLog('Connect success!');
    },
    onDisconnected: () => {
        appendLog('Disconnected.');
    },
});

// Monitor messages. All SDK message types are received through the onMessage callback.
client.addEventHandler('message', {
    onMessage: (message) => {
        console.log(message);
        if (message.type === 'text') {
            appendLog('Message from: ' + message.from + ' Message: ' + message.body.content);
        }
    },
});

// Define button actions.
window.onload = function () {
    // Log in.
    document.getElementById('login').onclick = async function () {
        userId = document.getElementById('userID').value.toString();
        token = document.getElementById('token').value.toString();

        try {
            await client.login({
                userId,
                token,
            });
            appendLog('Login success.');
        } catch (e) {
            console.log('login failed', e);
            appendLog('Login failed.');
        }
    };

    // Log out.
    document.getElementById('logout').onclick = async function () {
        await client.logout();
    };

    // Send a one-to-one text message.
    document.getElementById('send_peer_message').onclick = async function () {
        const peerId = document.getElementById('peerId').value.toString();
        const peerMessage = document.getElementById('peerMessage').value.toString();

        const message = client.chatManager.createTextMessage({
            conversationId: peerId,          // The peer user ID for a one-to-one chat.
            conversationType: 'singleChat', // Set the conversation type to a one-to-one chat.
            content: peerMessage,           // Text message content.
        });

        try {
            await client.chatManager.sendMessage(message);
            appendLog('Message send to: ' + peerId + ' Message: ' + peerMessage);
        } catch (e) {
            console.log('send private text failed', e);
            appendLog('Message send failed.');
        }
    };
};
```

:::tip
For TypeScript, import type declarations from `easemob-websdk` as needed, for example:

```typescript
import { ChatClient, ChatManager, type Message } from 'easemob-websdk';
```
:::

### Step 5: Run the project

This document uses webpack to bundle the project and `webpack-dev-server` to run it.

1. Add `webpack`, `webpack-cli`, and `webpack-dev-server` to `dependencies` in `package.json`, and add the `build` and `start:dev` commands to `scripts`.

```json
{
    "name": "web",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "build": "webpack --config webpack.config.js",
        "start:dev": "webpack serve --config webpack.config.js"
    },
    "dependencies": {
        "easemob-websdk": "latest",
        "webpack": "^5.50.0",
        "webpack-dev-server": "^5.0.0",
        "webpack-cli": "^5.0.0"
    },
    "author": "",
    "license": "ISC"
}
```

2. Add `webpack.config.js` to the project root to configure webpack. Its contents are as follows:

```javascript
const path = require('path');

module.exports = {
    entry: './index.js',
    mode: 'production',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
    },
    devServer: {
        compress: true,
        port: 9000,
        open: true,
    },
};
```

Your directory now contains the following files:

Easemob_quickstart<br>
├─ index.html<br>
├─ index.js<br>
├─ package.json<br>
└─ webpack.config.js

3. Run the following command in the project root to install dependencies.

```bash
$ npm install
```

4. Run the following commands to build and run the project with webpack.

```bash
# Bundle with webpack.
$ npm run build

# Run the project with webpack-dev-server.
$ npm run start:dev
```

After the project starts, enter the current user's user ID and token on the page to log in. After login succeeds, enter the peer user ID and the message to send, and click **send**. You can also log in as another user on another page to test sending and receiving one-to-one messages between the users.
