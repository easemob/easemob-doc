# App Creation and Launch Process

After you [create an app](app_create.html) in [EasyIM Console](https://console.easyim.ai/user/login), you can start using IM services. A newly created app is a **development version** by default and is intended for development, integration testing, and general testing. After development and testing are complete, you can apply to launch it as a **production version** for production deployment and business operations.

You can launch a development version app in either of the following ways:

- **Create a new production app**
  A new production version app is created with an App Key different from that of the development version. The feature configurations of the development version are automatically synchronized to the new app, while their business data remains completely isolated and is not shared.
  
- **Upgrade this development app to production**
  The development version app is upgraded directly to a production version app, and its App Key remains unchanged after launch. The production version inherits all feature configurations and existing business data from the development version.

The app creation and launch process is as follows:

![img](/images/console/app_create_to_launch.png)

**Process description**

The preceding figure shows the main process from creating a development version app to launching a production version app. The process consists of three stages: testing, launch, and post-launch processing.

1. **Testing stage**: After you [create a development version app](app_create.html), select IM services as needed and configure basic features. During this stage, you can freely change or cancel IM services.

2. **Launch stage**: After testing is complete, you can submit a [launch application](app_launch.html).

3. **Post-launch processing**: For details, see [Launch considerations](app_launch.html#launch-considerations).

