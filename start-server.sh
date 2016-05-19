#!/bin/bash
echo "$(date): starting server" >> deploy.log
nohup node server/server.js&
