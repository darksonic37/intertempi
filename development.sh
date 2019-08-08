#! /bin/bash

set -euxo pipefail

docker build --rm -t intertempi-api api
docker build --rm -t intertempi-client client

docker stack rm intertempi
docker swarm leave --force

docker swarm init
docker stack deploy -c development.yml intertempi

watch -n1 docker service ls
