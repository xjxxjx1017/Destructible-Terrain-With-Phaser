echo off

if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

echo starting web server...
npm run start
pause