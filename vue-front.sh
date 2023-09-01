#!/bin/bash
WORK_PATH='/usr/projects/vue-front'
cd $WORK_PATH
echo 'clear old'
git reset --hard origin/master
git clean -f
echo 'pull latest'
git pull origin master
echo '编译'
npm install
npm run build
echo 'build'
docker build -t vue-front:1.0 .
echo 'stop old container'
docker stop vue-front-container
docker rm vue-front-container
echo 'start new container'
docker container run -p 80:80 --name vue-front-container -d vue-front:1.0
