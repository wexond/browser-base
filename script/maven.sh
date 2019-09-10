#!/bin/bash

Help () {
   echo Build flowr-desktom for multi platform
   echo
   echo 'Usage: publish "archive path"'
   echo
   echo 'publish archive on taktik maven repository.'
   echo Note set environment variable MV_USER and MV_PASS with your maven credential.
   echo
   echo example: pubish dist/flowr-desktop_0.1.8_amd64.deb
}

PubilshDebianPackage ()
{
  echo Uploading $2 to https://apt.taktik.be/repository/apt/
  curl -u $MV_USER:$MV_PASS -X POST -H 'Content-Type: multipart/form-data' --data-binary '@'$2 https://apt.taktik.be/repository/apt/
}

Run()
{
    if [ $# = 0 ] || [ $1 = -h ] || [[ $1 =~ help ]]
    then
        Help
        exit 0
    fi

    PubilshDebianPackage $@
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
