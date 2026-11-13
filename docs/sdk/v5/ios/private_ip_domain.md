# Private Cloud SDK IP Address/Domain Configuration

The SDK connects to public cloud services by default. When using a private cloud, configure the private-cloud REST address and IM persistent connection address before initializing the SDK. Import `EMOptions+PrivateDeploy.h` before configuration.

:::tip
Starting from SDK v5.1.0, the SDK automatically determines the data synchronization WebSocket address from the configured private-cloud REST address. No separate configuration is required. `EMOptions#syncDataWSHost` and `EMOptions#syncDataWSPort` are removed.

`EMOptions#webSocketServer` and `EMOptions#webSocketPort` configure the IM persistent WebSocket connection, rather than the data synchronization WebSocket.
:::

## Statically configure an IP address/domain

For static configuration, set `EMOptions#enableDnsConfig` to `NO` and set the corresponding addresses for the IM persistent connection method. The following addresses and ports are examples. Replace them with the actual configuration provided by your private-cloud deployment.

### Method 1: TCP connection

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];

// Set the private-cloud REST address. The SDK automatically determines the data synchronization WebSocket address from this address.
options.restServer = @"https://private-rest.example.com";

// Set the TCP persistent connection address and port for sending and receiving IM messages.
options.chatServer = @"private-im.example.com";
options.chatPort = 6717;
options.enableTLSConnection = YES; // Use TLS to encrypt the TCP connection.

// Use the static addresses above instead of retrieving addresses from the DNS configuration service.
options.enableDnsConfig = NO;

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

### Method 2: WebSocket connection

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];

// Set the private-cloud REST address. The SDK automatically determines the data synchronization WebSocket address from this address.
options.restServer = @"https://private-rest.example.com";

// Set the WebSocket persistent connection address and port for sending and receiving IM messages.
options.webSocketServer = @"private-im.example.com";
options.webSocketPort = 443;
options.enableTLSConnection = YES; // Use an encrypted WSS connection.

// Use the static addresses above instead of retrieving addresses from the DNS configuration service.
options.enableDnsConfig = NO;

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## Dynamically configure addresses

1. Configure a DNS address table on the private-cloud server, including REST and IM persistent connection addresses.
2. Before initializing the SDK, set the DNS configuration service address through `EMOptions#dnsURL`.

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.dnsURL = @"https://private-dns.example.com/server.json";
options.enableDnsConfig = YES; // The default value is YES.
options.usingHttpsOnly = YES; // Use HTTPS only for REST requests.

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`optionsWithAppkey`](#statically-configure-an-ip-addressdomain) | `EMOptions` | Creates an SDK configuration object. |
| [`enableDnsConfig`](#statically-configure-an-ip-addressdomain) | `EMOptions (PrivateDeploy)` | Controls whether to use DNS configuration. When set to `NO`, static server addresses are used. |
| [`chatServer`](#method-1-tcp-connection) | `EMOptions (PrivateDeploy)` | Sets the TCP chat server address. |
| [`chatPort`](#method-1-tcp-connection) | `EMOptions (PrivateDeploy)` | Sets the TCP chat server port. |
| [`restServer`](#statically-configure-an-ip-addressdomain) | `EMOptions (PrivateDeploy)` | Sets the REST server address. The SDK automatically determines the data synchronization WebSocket address from this address. |
| [`webSocketServer`](#method-2-websocket-connection) | `EMOptions (PrivateDeploy)` | Sets the IM persistent WebSocket connection server address. |
| [`webSocketPort`](#method-2-websocket-connection) | `EMOptions (PrivateDeploy)` | Sets the IM persistent WebSocket connection server port. |
| [`enableTLSConnection`](#statically-configure-an-ip-addressdomain) | `EMOptions (PrivateDeploy)` | Enables TLS for TCP or WebSocket IM persistent connections. |
| [`usingHttpsOnly`](#dynamically-configure-addresses) | `EMOptions` | Uses HTTPS only to send REST requests. |
| [`dnsURL`](#dynamically-configure-addresses) | `EMOptions (PrivateDeploy)` | Sets the URL of the server-side DNS address table. |
| [`initializeSDKWithOptions`](#statically-configure-an-ip-addressdomain) | `EMClient` | Initializes the SDK using the preceding configuration. |
