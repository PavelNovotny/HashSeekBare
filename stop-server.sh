#!/bin/bash
echo "$(date): stopping server" >> deploy.log
PID=`ps -ef | grep "[0-9] node server/server.js" | awk '{print $2}'`
if [[ "" !=  "$PID" ]]; then
  ps -ef | grep '[0-9] node server/server.js' >> deploy.log
  echo "killing $PID" >> deploy.log
  kill -2 $PID
else
  echo "no PID found" >> deploy.log
fi
