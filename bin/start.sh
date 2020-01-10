#!/bin/bash
​
[ -s "/.nvm/nvm.sh" ] && \. "/.nvm/nvm.sh"
cd /var/www/html/website
nohup npm start > /dev/null 2>&1 &