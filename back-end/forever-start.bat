@ECHO OFF
ECHO Congratulations! Our server here.
forever start --minUptime 1000 --spinSleepTime 1000 server.js
PAUSE