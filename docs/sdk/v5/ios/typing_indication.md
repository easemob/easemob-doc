# Implement a Typing Indicator with Command Messages

A typing indicator shows when another user is typing a message. This feature facilitates effective communication between users and builds anticipation for interactions in a chat app.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Implementation process

You can implement a typing indicator with command messages. The following figure illustrates how a typing indicator works.

![img](/images/common/typing_indicator.png)

Monitor user A's typing state. As soon as text is entered, send the typing state to user B through a command message. After receiving the message, user B knows that user A is typing.

- User A sends user B a message indicating that user A has started typing.
- After receiving the message, user B displays user A's typing indicator if the chat page with user A is open.
- If user B does not receive another typing state from user A after several seconds, the typing indicator is automatically hidden.

:::tip
User A can set the command message sending interval as needed.
:::

### Send a typing-state command message

```objectivec
// Send a command message indicating that the user is typing.
#define MSG_TYPING_BEGIN @"TypingBegin"

- (void)textViewDidChange:(UITextView *)textView
{
    long long currentTimestamp = [self getCurrentTimestamp];
    // Do not send another message within 5 seconds.
    if ((currentTimestamp - _previousChangedTimeStamp) > 5) {
        // Send a command message indicating that the user has started typing.
        [self _sendBeginTyping];
        _previousChangedTimeStamp = currentTimestamp;
    }
}

- (void)_sendBeginTyping
{
    EMCmdMessageBody *body = [[EMCmdMessageBody alloc] initWithAction:MSG_TYPING_BEGIN];
    body.isDeliverOnlineOnly = YES;
    EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId body:body ext:nil];
    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
}
```

### Receive and parse typing-state command messages

The following sample code shows how to receive and parse typing-state command messages.

```objectivec
#define TypingTimerCountNum 10
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages
{
    NSString *conId = self.currentConversation.conversationId;
    for (EMChatMessage *message in aCmdMessages) {
        if (![conId isEqualToString:message.conversationId]) {
            continue;
        }
        EMCmdMessageBody *body = (EMCmdMessageBody *)message.body;
        // Received a command message indicating that the user is typing.
        if ([body.action isEqualToString:MSG_TYPING_BEGIN]) {
            if (_receiveTypingCountDownNum == 0) {
                [self startReceiveTypingTimer];
            }else {
                _receiveTypingCountDownNum = TypingTimerCountNum;
            }
        }

    }
}

- (void)startReceiveTypingTimer {
    [self stopReceiveTypingTimer];
    _receiveTypingCountDownNum = TypingTimerCountNum;
    _receiveTypingTimer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(startReceiveCountDown) userInfo:nil repeats:YES];

    [[NSRunLoop currentRunLoop] addTimer:_receiveTypingTimer forMode:UITrackingRunLoopMode];
    [_receiveTypingTimer fire];
    // Update the UI here to show "The other user is typing".
}

- (void)startReceiveCountDown
{
    if (_receiveTypingCountDownNum == 0) {
        [self stopReceiveTypingTimer];
        // Update the UI here to stop showing "The other user is typing".

        return;
    }
    _receiveTypingCountDownNum--;
}

- (void)stopReceiveTypingTimer {
    _receiveTypingCountDownNum = 0;
    if (_receiveTypingTimer) {
        [_receiveTypingTimer invalidate];
        _receiveTypingTimer = nil;
    }
}
```

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`initWithAction`](#send-a-typing-state-command-message) | `EMCmdMessageBody` | Creates a command message body that represents a typing state. |
| [`sendMessage`](#send-a-typing-state-command-message) | `EMChatManager` | Sends an online command message. |
