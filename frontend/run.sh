#!/usr/bin/bash
# Used to run frontend without docker compose
docker container run --rm -it -v $(pwd):/app -p $1:3000 loancalc_website
