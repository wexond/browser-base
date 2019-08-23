#!/bin/bash

Help () {
   echo Build flowr-desktom for multi platform
   echo
   echo "Usage: <platform> <electron-builder option>"
   echo
   echo "<platform> darwin | linux | win32"
   echo "<electron-builder option> option passed to electron-builder"
   echo Note set environment variable GH_TOKEN with your credential.
   echo
   echo example: darwin --publish always
}

GenerateImage ()
{
  platform=$1
   options=($@)
   unset options[0]
   npm_config_platform=${platform} node node_modules/electron/install.js
   npm run compile-${platform} -- ${options[@]}
}

Run()
{
    if [ $# = 0 ] || [ $1 = -h ] || [[ $1 =~ help ]]
    then
        Help
        exit 0
    fi

    GenerateImage $@
}


if [ $# = 0 ]
then
    echo "type you command or help"
    read -a parameters
    Run ${parameters[@]}
else
    Run $@
fi
exit 0
