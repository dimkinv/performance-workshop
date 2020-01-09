# Intro
Dear participant, this workshop intent is to give you practical knowledge on web app performance. This workshop consists of the following: 

* `awesome-app` folder - this folder is for out awesome app that is full of perfromance problems and the one we should eventually fix. 
* `README.md` find - the file you are reading right now. Please read it carefully and follow the intructions. 

## What you will need
To successfully complete this workshop you will need:

* Docker installed as we will setup a container with `nginx` that will host our app 

> If you don't have docker you can install `nginx` manually on your laptop_

> You can work without `nginx` alltogether but you will not be able to complete part of the workshop

* Your IDE of choice, you will need to edit files and add some code in order to complete this workshop.

# Starting the project
In order to see the app you will need to run `nginx` container and point it to the awesome app folder. Please use the following command (add the port you'd like the app to be visible on and the **absolute** path to the `awesome-app` folder):

`docker run --rm --name some-nginx -p <LOCAL_PORT>:80 -v <ABSOLUTE_PATH>:/usr/share/nginx/html:ro -it nginx`
