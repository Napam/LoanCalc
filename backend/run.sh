#!/usr/bin/bash
# Used to run backend without docker compose
docker container run --rm -it -v $(pwd):/app -p $1:80 loancalc_api-service /bin/bash 
