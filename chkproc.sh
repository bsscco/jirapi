daemon=`netstat -tlnp | grep :::7000 | wc -l`
if [ "$daemon" -eq "0" ] ; then
        nohup node /home/bsscco/jirapi/app.js &
fi