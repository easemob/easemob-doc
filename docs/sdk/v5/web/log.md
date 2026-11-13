# SDK Logs

EasyIM logs record SDK-related information. The EasyIM technical support team may ask you to provide SDK logs when helping you troubleshoot an issue.

## Log levels

The SDK supports the following log levels:

| Level | Value | Description |
| :--- | :--- | :--- |
| Debug | `'DEBUG'` | Outputs debug logs. |
| Warning | `'WARN'` | Outputs warning logs. |
| Error | `'ERROR'` | Outputs error logs. |

The following example configures the log level:

```typescript
setLogLevel('WARN');
```

## Console output and log callbacks

Starting with SDK v5.1.2, call `setConsoleLogEnabled` to control whether the SDK outputs logs to the runtime console. You can also receive assembled and sanitized structured logs through the `onLog` event. Each entry contains `timestamp`, `level`, `message`, and `args`. Disabling console output does not affect `onLog` callbacks or log reporting.

In the following example, `applicationLogger` represents your app's logging service:

```typescript
// Disable SDK console logs without affecting onLog or log reporting.
setConsoleLogEnabled(false);

client.addEventHandler('log-listener', {
  onLog: entry => {
    // The SDK has sanitized the entry. Collect and process it in your app.
    applicationLogger.write(entry);
  },
});
```

## Log reporting

The Web SDK supports reporting logs to the EasyIM server. This feature is disabled by default. To enable it, contact the EasyIM business manager.
