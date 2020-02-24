#!/bin/bash
​
[ -s "/.nvm/nvm.sh" ] && \. "/.nvm/nvm.sh"
cd /var/www/html/website
MY_NODE_PATH=$(which npm)
ps ax | grep "node ./bin/www" | grep -v grep | awk '{print $1}' | xargs kill -9
sudo nohup "$MY_NODE_PATH" start > /tmp/nodelog.out 2>&1 &