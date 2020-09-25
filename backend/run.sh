#!/usr/bin/bash

docker container run --rm -it -v $(pwd):/app -p $1:80 stacc-image /bin/bash 
