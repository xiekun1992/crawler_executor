# Q&A
## sh: 1: node: Permission denied
`root@vultr:~/node-app/crawler_executor# npm i`
```
> core-js@3.8.3 postinstall /root/node-app/crawler_executor/node_modules/core-js
> node -e "try{require('./postinstall')}catch(e){}"

sh: 1: node: Permission denied

> electron@10.1.5 postinstall /root/node-app/crawler_executor/node_modules/electron
> node install.js

sh: 1: node: Permission denied
npm WARN crawl@1.0.0 No description
npm WARN crawl@1.0.0 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: core-js@3.8.3 (node_modules/core-js):
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: core-js@3.8.3 postinstall: `node -e "try{require('./postinstall')}catch(e){}"`
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: spawn ENOENT

npm ERR! code ELIFECYCLE
npm ERR! syscall spawn
npm ERR! file sh
npm ERR! errno ENOENT
npm ERR! electron@10.1.5 postinstall: `node install.js`
npm ERR! spawn ENOENT
npm ERR!
npm ERR! Failed at the electron@10.1.5 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2021-01-23T13_58_52_156Z-debug.log
```

`root@vultr:~/node-app/crawler_executor/node_modules# npm config set user 0`

`root@vultr:~/node-app/crawler_executor/node_modules# npm config set unsafe-perm true`

## Run electron on linux server
`root@vultr:~# apt install xvfb`
## Fix dependencies error
`root@vultr:~/node-app/crawler_executor# xvfb-run electron .`
```
/root/node-app/node-v14.15.4-linux-x64/lib/node_modules/electron/dist/electron: error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory
```
`root@vultr:~/node-app/crawler_executor# apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb`

`root@vultr:~/node-app/crawler_executor# xvfb-run electron .`
```
/root/node-app/node-v14.15.4-linux-x64/lib/node_modules/electron/dist/electron: error while loading shared libraries: libatk-bridge-2.0.so.0: cannot open shared object file: No such file or directory
```
`root@vultr:~/node-app/crawler_executor# apt-get install libatk-bridge2.0-0`

`root@vultr:~/node-app/crawler_executor# xvfb-run electron .`
```
/root/node-app/node-v14.15.4-linux-x64/lib/node_modules/electron/dist/electron: error while loading shared libraries: libgtk-3.so.0: cannot open shared object file: No such file or directory
```
`root@vultr:~/node-app/crawler_executor# apt install libgtk-3-0`

`root@vultr:~/node-app/crawler_executor# xvfb-run electron .`
```
/root/node-app/node-v14.15.4-linux-x64/lib/node_modules/electron/dist/electron: error while loading shared libraries: libgbm.so.1:cannot open shared object file: No such file or directory
```
`root@vultr:~/node-app/crawler_executor# apt-get install -y libgbm-dev`

`root@vultr:~/node-app/crawler_executor# xvfb-run electron .`
```
[2095780:0123/151216.119860:FATAL:electron_main_delegate.cc(253)] Running as root without --no-sandbox is not supported. See https://crbug.com/638180.
/root/node-app/node-v14.15.4-linux-x64/lib/node_modules/electron/dist/electron exited with signal SIGTRAP
```
`root@vultr:~/node-app/crawler_executor# xvfb-run -a electron . --no-sandbox`