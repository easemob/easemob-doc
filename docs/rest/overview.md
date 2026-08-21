# Server API Overview

<Toc />

EasyIM provides server-side APIs through its REST platform. You can send HTTP requests from your business server to the EasyIM REST server to implement real-time communication on the server side.

EasyIM Server SDKs also provide management capabilities for resources such as users, messages, chat groups, and chat rooms. For details, see [Java Server SDK](java_server_sdk.html) and [PHP Server SDK](php_server_sdk.html).

## REST platform architecture

The EasyIM REST platform provides a multi-tenant architecture and manages resources as collections. A collection contains the following subsets:

- Databases (database)
- Organizations (orgs)
- Apps (apps)
- Users (users)
- Chat groups (chatgroups)
- Messages (chatmessages)
- Files (chatfiles)

User data is isolated between different orgs. Within the same org, user data is also isolated between different apps. The data architecture of an org is shown below:

![img](/images/server-side/prepare_to_use_api.png)

## Request structure

### Request URL

For example, the request URL for registering a user is as follows:

```http
POST https://{host}/{org_name}/{app_name}/users
```

Each request URL contains the `host`, `org_name`, and `app_name` parameters.

| Parameter       | Type   | Required | Description         |
| :--------- | :----- | :------- | :------------------------- |
| `host`     | String | Yes       | Domain assigned by EasyIM for accessing RESTful APIs.<br/> - To meet different customers' business requirements, EasyIM has deployed data centers in multiple locations. REST API request domains vary by data center. Select the request domain for your data center.<br/> - Customers in the domestic VIP region or customer service region should contact their EasyIM business manager to obtain the REST API request address.<br/> -  HTTP and HTTPS are supported.|
| `org_name` | String | Yes       | Unique identifier assigned by EasyIM to each company (organization). |
| `app_name` | String | Yes       | App name entered when you created the app in the EasyIM Console.|

You can view the app's domain `host`, organization name `org_name`, and app name `app_name` on the **App Overview** page of the EasyIM Console.

![img](/images/server-side/app_info.png)

### Request header fields

| Parameter | Type   | Required | Description     |
| :-------------- | :----- | :----------------- | :-------------------- |
| `Content-Type`  | String | Yes                                       | Content type. Set it to `application/json`.    |
| `Accept`        | String | Yes                                       | Content type. Set it to `application/json`.    |
| `Authorization` | String | Yes                                       | App admin authentication token in the format `Bearer YourAppToken`, where `Bearer` is a fixed string followed by a space and the obtained app token.<br/>EasyIM REST APIs require Bearer HTTP authentication. You must include this field in the request header each time you send an HTTP request. For information about obtaining a dynamic app token, see [Authenticate with an EasyIM App Token](easemob_app_token.html). |

### Request body

The request body depends on the specific request.

### Communication protocols

EasyIM REST APIs support HTTP and HTTPS.

### Data format

- Request: For the request format, see the example for the specific API.
- Response: Response content is in JSON format.

All request URLs and request body content are case-sensitive.

## Server-side API list

For the method, API URL, brief description, and call frequency limit of each REST API, see [RESTful API call frequency limits](/document/server-side/limitationapi.html).

## Prerequisites for calling APIs

Before calling EasyIM RESTful APIs, ensure that the following requirements are met:

- In the [EasyIM Console](https://console.easyim.ai/user/login), you have [registered an account](/product/console/account_register.html) and [created an app](/product/console/app_create.html).
- You have obtained an app token from the server. For details, see [Authenticate with an App Token](easemob_app_token.html).
