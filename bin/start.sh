#!/bin/bash
​
[ -s "/.nvm/nvm.sh" ] && \. "/.nvm/nvm.sh"
cd /var/www/html/website
ps ax | grep "node ./bin/www" | grep -v grep | awk '{print $1}' | xargs kill -9
sudo nohup npm start > /tmp/nodelog.out 2>&1 &