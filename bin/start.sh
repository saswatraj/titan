#!/bin/bash
​
[ -s "/.nvm/nvm.sh" ] && \. "/.nvm/nvm.sh"
cd /var/www/html/website
nohup npm start > /tmp/nodelog.out 2>&1 &