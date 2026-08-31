# User Attributes

User attributes are profile information about users who participate in real-time messaging, such as user nicknames, avatars, email addresses, phone numbers, genders, signatures, and birthdays.

EasyIM provides storage for user attributes. You can store the following information as needed:

- Default profile fields, which can be read and written;
- Custom profile fields, which can be read and written.

## User attribute fields

All attributes of a single user cannot exceed 2 KB, and all user attribute data in a single app cannot exceed 10 GB.

For user attributes, the client uses the following default keys for the user nickname, avatar URL, contact information, email address, gender, signature, birthday, and extension fields. When you call a RESTful API to [set](/rest/user_attribute_set.html) or [delete](/rest/user_attribute_delete.html) user attributes, you must pass the following keys in the request to keep them consistent with the client and ensure that the settings can be retrieved on the client. Set the values based on your use case.

| Field    | Type   | Description   |
| :---------- | :----- | :------- |
| `nickname`  | String | User nickname. The maximum length is 64 characters.     |
| `avatarurl` | String | User avatar URL. The maximum length is 256 characters.      |
| `phone`     | String | User contact information. The maximum length is 32 characters.   |
| `mail`      | String | User email address. The maximum length is 64 characters.    |
| `gender`    | Int    | User gender:<br/> - `1`: Male; <br/> - `2`: Female; <br/> - (Default) `0`: Unknown; <br/> - Any other value is invalid. |
| `sign`      | String | User signature. The maximum length is 256 characters.  |
| `birth`     | String | User birthday. The maximum length is 64 characters.  |
| `ext`       | String | Extension field.  |
