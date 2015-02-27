#!/bin/sh
if gulp release; then # code syntax is ok
  if git push; then   # code fullfills specs
    ssh paqmind@dgo 'bash -s' < bin/release.remote.sh
  fi
fi
