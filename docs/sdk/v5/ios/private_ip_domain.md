# Private Cloud SDK IP Address/Domain Configuration

Before configuring private cloud deployment, import `EMOptions+PrivateDeploy.h`. The following configurations can be set only when `initializeSDKWithOptions:` is called and cannot be changed dynamically at runtime.

## Statically configure an IP address/domain

By default, the SDK points to public cloud addresses. After private cloud deployment, you must redirect the addresses to the new addresses. Configure them as follows:

### Method 1: TCP connection

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:appkey];
options.enableDnsConfig = NO;
options.chatPort = 8080;// Set the port number.
options.chatServer = @"xxx.xxx.xxx.xxx";// Set the IP address.
options.restServer = @"xxx.xxx.xxx.xxx:8080";// Set ip:port.
options.enableTLSConnection = YES;// Whether to use an encrypted connection. TCP connections use TLS encryption.
[[EMClient sharedClient] initializeSDKWithOptions:options];
```
### Method 2: WebSocket connection

```objectivec
EMOptions* options = [EMOptions optionsWithAppkey:@"Your appkey"];
options.enableDnsConfig = NO;
options.restServer = @"https://restaddress";
options.webSocketServer = @"im-api-wechat.easemob.com";
options.webSocketPort = 443;
options.enableTLSConnection = YES;// Whether to use an encrypted connection. WebSocket uses WSS.
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

:::tip
To use HTTPS only, set this property before calling `initializeSDKWithOptions:`.
:::

```objectivec
options.usingHttpsOnly = YES;
```

## Dynamically configure addresses

1. Configure the DNS address table on the server.
2. Set the URL configured on the server.

```objectivec
options.enableDnsConfig = YES;
options.dnsURL = @"xxxx";// Set the URL configured on the server.
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`optionsWithAppkey`](#statically-configure-an-ip-addressdomain) | `EMOptions` | Creates an SDK configuration object. |
| [`enableDnsConfig`](#statically-configure-an-ip-addressdomain) | `EMOptions (PrivateDeploy)` | Controls whether to use DNS configuration. When set to `NO`, static server addresses are used. |
| [`chatServer`](#method-1-tcp-connection) | `EMOptions (PrivateDeploy)` | Sets the TCP chat server address. |
| [`chatPort`](#method-1-tcp-connection) | `EMOptions (PrivateDeploy)` | Sets the TCP chat server port. |
| [`restServer`](#statically-configure-an-ip-addressdomain) | `EMOptions (PrivateDeploy)` | Sets the REST server address. |
| [`webSocketServer`](#method-2-websocket-connection) | `EMOptions (PrivateDeploy)` | Sets the WebSocket server address. |
| [`webSocketPort`](#method-2-websocket-connection) | `EMOptions (PrivateDeploy)` | Sets the WebSocket server port. |
| [`enableTLSConnection`](#statically-configure-an-ip-addressdomain) | `EMOptions (PrivateDeploy)` | Enables TLS for chat or WebSocket connections. |
| [`usingHttpsOnly`](#statically-configure-an-ip-addressdomain) | `EMOptions` | Uses only HTTPS. |
| [`dnsURL`](#dynamically-configure-addresses) | `EMOptions (PrivateDeploy)` | Sets the URL of the server-side DNS address table. |
| [`initializeSDKWithOptions`](#statically-configure-an-ip-addressdomain) | `EMClient` | Initializes the SDK using the preceding configuration. |
