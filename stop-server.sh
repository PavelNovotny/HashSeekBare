#!/bin/bash
echo "$(date): stopping server" >> deploy.log
PID=`ps -eaf | grep '[0-9] node server.js' awk '{print $2}'`
if [[ "" !=  "$PID" ]]; then
  echo "killing $PID"
  kill -9 $PID
fi