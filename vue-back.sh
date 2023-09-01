#!/bin/bash
WORK_PATH='/usr/projects/vue-back'
cd $WORK_PATH
echo 'clear old'
git reset --hard origin/master
git clean -f
echo 'pull latest'
git pull origin master
echo 'build'
docker build -t vue-back:1.0 .
echo 'stop old container'
docker stop vue-back-container
docker rm vue-back-container
echo 'start new container'
docker container run -p 3000:3000 --name vue-back-container -d vue-back:1.0
