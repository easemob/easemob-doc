# Common Push Error Codes

When you call a REST API related to offline push and the returned HTTP status code is not 200, the request fails and an error is reported. This section lists common error codes for these APIs. 

## Common error codes for push settings and queries

The REST APIs related to offline push settings and queries, including **Set the Receiver's Push Template Name** and **Retrieve the Receiver's Push Template Name**, are listed below:

| RESTful API        | Method | API URL           |
| :----------- | :--- | :------------- |
| Bind and unbind push information           | PUT  | /{org_name}/{app_name}/users/{userId}/push/binding |
| Retrieve push binding information    | GET  | /{org_name}/{app_name}/users/{userId}/push/binding |
| Set the nickname displayed in offline push notifications | PUT  | /{org_name}/{app_name}/users/{userId} |
| Set the offline push notification display mode | PUT  | /{org_name}/{app_name}/users/{userId} |
| Configure offline push         | PUT  | /{org_name}/{app_name}/users/{userId}/notification/{chattype}/{key} |
| Retrieve offline push settings     | GET  | /{org_name}/{app_name}/users/{userId}/notification/{chattype}/{key} |
| Set the preferred language for push notifications     | PUT  | /{org_name}/{app_name}/users/{userId}/notification/language |
| Retrieve the preferred language for push notifications | GET  | /{org_name}/{app_name}/users/{userId}/notification/language |
| Set the receiver's push template name | PUT  | /{org_name}/{app_name}/users/{userId}/notification/template |
| Retrieve the receiver's push template name | GET | /{org_name}/{app_name}/users/{userId}/notification/template |

Common error codes for the preceding APIs are listed below:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400 | RequiredPropertyNotFoundException | Entity user requires a property named username | The user does not exist. | Check and modify the request parameters. Specify a valid existing user ID. |
| 400  | IllegalArgumentException | parameters is invalid : XXX | The value of the XXX property is invalid. | Check and modify the request parameters. Specify a value within the allowed range.|
| 404 | Request path does not exist | url is invalid | The request path is incorrect. | Check and modify the request to use the correct path. |
| 5xx | Internal server error   | Any      | An internal error occurred while the server was processing the request.| Contact Easemob technical support. |

## Common error codes for push template APIs

The APIs related to offline push templates are listed below:

| RESTful API        | Method | API URL           |
| :----------- | :--- | :------------- |
| Create an offline push template          | POST  | /{org_name}/{app_name}/notification/template |
| Modify an offline push template      | PUT  | /{org_name}/{app_name}/notification/template/{name} |
| Retrieve an offline push template | GET | /{org_name}/{app_name}/notification/template/{name} |
| Delete an offline push template          | DELETE  | /{org_name}/{app_name}/notification/template/{name} |

Common error codes for these REST APIs are listed below:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400  | EntityNotFoundException | XXX template is not exist | The XXX template does not exist. | Check and modify the request parameters. Specify a valid existing template name. |
| 404 | Request path does not exist | url is invalid | The request path is incorrect. | Check and modify the request to use the correct path. |
| 5xx | Internal server error   | Any      | An internal error occurred while the server was processing the request. | Contact Easemob technical support. |

For other errors, see [Error code](error.html) for possible causes.






