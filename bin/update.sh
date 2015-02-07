#!/bin/sh

git push
ssh paqmind@dgo 'bash -s' < bin/update.remote.sh
