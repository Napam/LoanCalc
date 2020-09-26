#!/usr/bin/bash

docker container run --rm -it -v $(pwd):/app -p $1:3000 stacc-react-image 
