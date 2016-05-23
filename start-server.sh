#!/bin/bash
npm install >> deploy.log
echo "$(date): starting server " $1 >> deploy.log
if [[ -n "$1" ]]; then
    nohup node server/server.js --env $1 > Output.out 2> Error.err < /dev/null &
else
    nohup node server/server.js > Output.out 2> Error.err < /dev/null &
fi


