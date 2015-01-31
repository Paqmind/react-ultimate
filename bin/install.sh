#!/bin/sh

scp -r ./bin/setup.sh paqmind@dgo:/home/paqmind/twitto.paqmind.com
ssh paqmind@dgo 'bash -s' < bin/deploy.remote.sh
