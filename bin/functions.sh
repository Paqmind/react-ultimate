#!/bin/sh

# return 1 if global command line program installed, else 0
function program_installed {
  # set to 1 initially
  local return=1
  # set to 0 if not found
  type $1 >/dev/null 2>&1 || { local return=0; }
  # return value
  echo "$return"
}

# return 1 if npm package is installed else 0
function npm_package_installed {
  if [ $(npm list --depth 0 --parseable true "${2}" | grep "${1}$") ]; then
    echo "1"
  else
    echo "0"
  fi
}
