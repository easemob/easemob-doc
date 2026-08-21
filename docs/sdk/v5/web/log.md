# SDK Logs

EasyIM logs record SDK-related information. The Easemob technical support team may ask you to provide SDK logs when helping you troubleshoot an issue.

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

## Log reporting

The Web SDK supports reporting logs to the EasyIM server. This feature is disabled by default. To enable it, contact the EasyIM business manager.
