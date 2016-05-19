#!/bin/bash
echo "$(date): stopping server" >> deploy.log
PID=`ps -eaf | grep 'node server.js' | grep -v grep | awk '{print $2}'`
if [[ "" !=  "$PID" ]]; then
  echo "killing $PID"
  kill -9 $PID
fi