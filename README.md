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

After container is up you should be able to see it running at `http://localhost:<LOCAL_PORT>`

Because we are running this prject locally it will be very hard to see performance differences as webapp will load almost instanteniously. 

To simulate loading time we will nee to throttle down the connection, this can be done in chrome DevTools.
Please throttle connection down to `Fast 3G`. Also please diable cache

# Workshop
In this workshop you will learn about performance API and write some code to see what is hapenning in begind the scenes. 
After that you will make changes to the `awesome-app` to make it faster and better. This workshop concentrates on the following changes:

* Activating gzip
* Decrease media size
* CSS critical path
* Splitting code into chunks
* Deferring offscreen images

# Workshop Exercise
Before you begin the optimization exercise please finish the performance [library exercise](PERFORMANCE.md)
## Activate gzip
1. Load the app and look at the `index.html` file in network tab response headers. You can see that through browser sent `Accept-Encoding: gzip, deflate, br` header the content came up uncompressed.
1. Inside `default.conf` file (which is the configuration file for nginx) please add `gzip on;` on line 2.
1. Restart the container and look on the request again
1. You should now be able to see response header `Content-Encoding: gzip` sent back from server
1. Please reload the app and notice the differences in performance.
1. By default `nginx` will only activate gzip on `text/plain` MIME type. To improve performance event better please add `gzip_types text/plain application/javascript text/css;` to line 3. 
1. Check the performance report again and see if there was further improvement, calculate how much time improvement you have achieved and calculate the improvement prcentage 

## Lowering media size
1. Find some onlint convert tool and convert all jpg files into webp, you can use [this](https://convertio.co/jpg-webp/) or [this](https://ezgif.com/jpg-to-webp) site for the task.

1. Check the performance report again and see if there was further improvement, calculate how much time improvement you have achieved and calculate the improvement prcentage 

1. (BONUS) lower image size when applicable for more improvement

## CSS Critical Path
1. Go and look on the style css file, you will find that some of it is not relevant for the initial page load. 
2. Cut only the relevant top part and put as an inline css script inside `index.html`
3. Add the following line to `index.html` to load the rest of the css but not as part of the initial loading of the page
```
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```
4. Check the performance report again, pay special attention on the `first-paint` and `first-contentful-paint` timings and see if there was further improvement, calculate how much time improvement you have achieved and calculate the improvement prcentage 
5. You can also run Audit in chrome dev tools and watch the difference in the `Eliminate render-blocking resources` opportunity

> Essentially the line above works by telling the browser to prefetch the stylesheed but not to render it. and upon fetching then turn it into normal css `link` tag

## Splitting code into chunks
The `getWeather` function loads weather at the bottom of the screen, so it's actually not needed at the beginning of the load of the page. So let's defer it.

1. Find the script reference that runs the `getWeather` function in `index.html` and add `defer` to the tag
2. Measure again and pay attention to the `DOMContentLoaded` event change

## Deferring Offscreen Images
There are a lot of libraries that can help us to lazy load images based on bounding box of the viewport. In this workshop we will use (lazysizes)[https://github.com/aFarkas/lazysizes]. You can download latest version [here](https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js)

1. Download the library and add it in the head of the `index.html`
2. Replace `img` to: `<img data-src="<IMAGE_PATH>" class="lazyload c-product__image" />`
3. Check the performance report again and see if there was further improvement, calculate how much time improvement you have achieved and calculate the improvement prcentage 
4. Pay attention to the network tab, you should only be able to see the images loading when you scroll down to the images.

> There are different ways to lazy load images, but most of them make use of the (Intercention Observer API)[https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API]

## Activating HTTP/2
In order to activate HTTP/2 on the nginx server we first need to add TLS certificate to it. The reason behind it is because HTTP/2 only works over secured connection.

In the project folders under `/cert` you will find the certificate files. We need these files to be configured inside nginx configurations.
Please change the `/default.conf` file to the following:
```
server {
    listen       443 ssl;
    listen  [::]:443 ssl;
    server_name  localhost;
    ssl_certificate /etc/cert/server.crt;
    ssl_certificate_key /etc/cert/server.key;
    ssl_protocols TLSv1.2;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
This will effectively activate ssl on the localhost.
The command with which you run the docker should also change and will look like this:

```
docker run --rm --name some-nginx -p 8080:443 \
-v <GITHUB_PROJECT_ABSOLUTE_PATH>/cert:/etc/cert \
-v <GITHUB_PROJECT_ABSOLUTE_PATH>/default.conf:/etc/nginx/conf.d/default.conf \
-v <GITHUB_PROJECT_ABSOLUTE_PATH>/awesome-app:/usr/share/nginx/html:ro -it nginx
```
You will be asked to enter the certificate password, enter `Aa123456`
After you run this all hell will break loose! Chrome will not agree to run https on localhost. This is actually a security threat so we will allow it only to the duration of this workshop and **will** remember to turn it off again right after. 

In order to enable secure localhost:
1. goto chrome://flags/#allow-insecure-localhost - this is the place where dragons live
1. enable "Allow invalid certificates for resources loaded from localhost." option
1. restart chrome.

Check that http://localhost:<PORT_YOU_CHOSE> is working.

Next, let's activate http/2. In nginx it is as simple as adding `http2` to the end of the 2 `listen` lines like so:
```
    listen       443 ssl http2;
    listen  [::]:443 ssl http2;
```
This is all whats needed to activate http/2 on our website. But wait, how about pushing files via http/2 connection? Well, this can be done by adding the list of files to the nginx configurations.

Let's add the images and the css file to be pushed by the server. change the `/location` scope to the following:
```
location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    http2_push /styles.css;
    http2_push /images/product-1.jpg;
    http2_push /images/product-2.jpg;
    http2_push /images/product-3.jpg;
    http2_push /images/product-4.jpg;
    http2_push /images/hero.jpg;
}
```
Now re-run docker
1. You should be able to see in network tab that the protocol now is http/2 and that images initiator is `push`
2. Run lighthouse again... did performance changed? How faster it is now?

Good luck!
