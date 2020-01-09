# Intro
Dear participant, this workshop intent is to give you practical knowledge on web app performance. This workshop consists of the following: 

* `awesome-app` folder - this folder is for out awesome app that is full of perfromance problems and the one we should eventually fix. 
* `README.md` find - the file you are reading right now. Please read it carefully and follow the intructions. 

## What you will need
To successfully complete this workshop you will need:

* Docker installed as we will setup a container with `nginx` that will host our app 

> If you don't have docker you can install `nginx` manually on your laptop

> You can work without `nginx` alltogether but you will not be able to complete part of the workshop

* Your IDE of choice, you will need to edit files and add some code in order to complete this workshop.

# Starting the project
In order to see the app you will need to run `nginx` container and point it to the awesome app folder. Please use the following command (add the port you'd like the app to be visible on and the **absolute** path to this github project folder):

```
docker run --rm --name some-nginx -p <LOCAL_PORT>:80 \
-v <GITHUB_PROJECT_ABSOLUTE_PATH>/default.conf:/etc/nginx/conf.d/default.conf \
-v <GITHUB_PROJECT_ABSOLUTE_PATH>/awesome-app:/usr/share/nginx/html:ro -it nginx
```

After container is up you should be able to see it running at `http://localhost:<PORT_CHOSEN>`

Because we are running this prject locally it will be very hard to see performance differences as webapp will load almost instanteniously. 

To simulate loading time we will nee to throttle down the connection, this can be done in chrome DevTools.
Please throttle connection down to `Fast 3G`. Also please diable cache

# Workshop wrogress
In this workshop you will learn about performance API and write some code to see what is hapenning in begind the scenes. 
After that you will make changes to the `awesome-app` to make it faster and better. This workshop concentrates on the following changes:

* Activating gzip
* Decrease media size
* Splitting code into chunks
* Deferring offscrean images
* CSS critical path
* Activating HTTP/2

# Workshop progress
## Activate gzip
1. Load the app and look at the `index.html` file in network tab response headers. You can see that thogh browser sent `Accept-Encoding: gzip, deflate, br` header the content came up uncompressed.
1. Inside `default.conf` file (which is the configuration file for nginx) please add `gzip on;` on line 2.
1. Restart the container and look on the request again
1. You should now be able to see response header `Content-Encoding: gzip` sent back from server
1. Please reload the app and notice the differences in performance.
1. By default `nginx` will only activate gzip on `text/plain` MIME type. To improve performance event better please add `gzip_types text/plain application/javascript text/css;` to line 3. 
1. Check the performance report again and see if there was further improvement