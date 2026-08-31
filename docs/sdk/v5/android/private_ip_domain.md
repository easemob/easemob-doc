# Private Cloud SDK IP Address/Domain Configuration

## Statically configure an IP address/domain

The SDK connects to public cloud services by default. When using a private cloud, configure the private-cloud REST and EasyIM service addresses through `EMOptions` before initializing the SDK. When statically configuring private-cloud addresses, call `enableDNSConfig(false)` to disable SDK DNS address configuration.

### Method 1: TCP connection

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// REST service address. Enter the domain or IP address and port based on the private-cloud deployment configuration.
options.setRestServer("https://rest.example.com:443");
// EasyIM service address and TCP port.
options.setIMServer("im.example.com");
options.setImPort(443);
// Whether to enable TLS for the EasyIM connection.
options.setEnableTLSConnection(true);
// Disable SDK DNS address configuration when using static private-cloud addresses.
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

### Method 2: WebSocket connection

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// REST service address. Include the https:// prefix when using HTTPS.
options.setRestServer("https://rest.example.com:443");
// WebSocket service address and port.
options.setWebSocketServer("ws.example.com");
options.setWebSocketPort(443);
// Whether to enable TLS for the WebSocket connection. WSS is used when TLS is enabled.
options.setEnableTLSConnection(true);
// Disable SDK DNS address configuration when using static private-cloud addresses.
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

:::tip
When the REST service uses HTTPS, the REST address must include the `https://` prefix. `setEnableTLSConnection(true)` controls whether TLS is enabled for an EasyIM TCP or WebSocket connection; it does not automatically add HTTPS to the REST address.
:::

```java
options.setRestServer("https://10.10.10.10:443");
```

## Dynamically configure addresses

If the private cloud has a DNS service that provides service addresses, set the DNS service address before SDK initialization. SDK DNS address configuration is enabled by default. When using dynamic address configuration, you do not need to call `enableDNSConfig(false)`.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// Configure the DNS service address that provides service addresses.
options.setDnsUrl("https://dns.example.com");
EMClient.getInstance().init(context, options);
```
