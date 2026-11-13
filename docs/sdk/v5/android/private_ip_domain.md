# Private Cloud SDK IP Address/Domain Configuration

The SDK connects to public cloud services by default. When using a private cloud, configure the private-cloud REST address and IM persistent connection address before initializing the SDK.

:::tip
In Android SDK v5.1.0 and later, the SDK automatically determines the data synchronization WebSocket address from the configured private-cloud REST address. No separate configuration is required.

Starting from Android SDK v5.1.0, the following data synchronization WebSocket configuration APIs are removed: `EMOptions#setSyncDataWebSocketServer(String)`, `EMOptions#getSyncDataWebSocketServer()`, `EMOptions#setSyncDataWebSocketPort(int)`, and `EMOptions#getSyncDataWebSocketPort()`.

`EMOptions#setWebSocketServer` and `EMOptions#setWebSocketPort` configure the IM persistent WebSocket connection, rather than the data synchronization WebSocket.
:::

## Statically configure an IP address/domain

For static configuration, disable dynamic DNS configuration and set the corresponding addresses for the IM persistent connection method.

The following addresses and ports are examples. Replace them with the actual configuration provided by your private-cloud deployment. If the REST service uses HTTPS, explicitly include `https://` in the address. If no protocol is specified, the SDK uses HTTP.

### Method 1: TCP connection

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");

// Set the private-cloud REST address.
options.setRestServer("https://private-rest.example.com");

// Set the TCP persistent connection address and port for sending and receiving IM messages.
options.setIMServer("private-im.example.com");
options.setImPort(6717);
options.setEnableTLSConnection(true); // Use TLS to encrypt the TCP connection.

// Use the static addresses above instead of retrieving addresses from the DNS configuration service.
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

### Method 2: WebSocket connection

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");

// Set the private-cloud REST address.
options.setRestServer("https://private-rest.example.com");

// Set the WebSocket persistent connection address and port for sending and receiving IM messages.
options.setWebSocketServer("private-im.example.com");
options.setWebSocketPort(443);
options.setEnableTLSConnection(true); // Use an encrypted WSS connection.

// Use the static addresses above instead of retrieving addresses from the DNS configuration service.
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

## Dynamically configure addresses

1. Configure a DNS address table on the private-cloud server, including REST and IM persistent connection addresses.
2. Before initializing the SDK, set the DNS configuration service address through `EMOptions#setDnsUrl`.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDnsUrl("https://private-dns.example.com/server.json");
options.enableDNSConfig(true); // The default value is true.

EMClient.getInstance().init(context, options);
```
