
stream-log is a simple utility to allow you to watch a remote file in realtime on your browser via websockets.

Features
========

* Transmitting the updates to the users browser using Websockets
* Infinite upward scroll simulates terminal application

Install and Run
===============
1. Dependencies

* NPM and Node Versions
```
 npm -v
 3.10.10
 
 node -v
v6.9.5
```

* Install node modules
```
npm install
```
2. Run

To run, all you need to do is run the command and pass it a file:

```
  node bin/stream-log --file logs/hs_err_pid3199.log
```

Point your browser at [http://localhost:3000](http://localhost:3000) to see the results.


You have a few extra options:

```
  node bin/stream-log --file logs/hs_err_pid3199.log --port 3000 --lineCount 1000
```

--port is the webserver port and --lineCount is the number of bytes to send to the client at a time.

Browser Support
===============

I have only tested this on Chrome only :/

Screenshot
===============
![Optional Text](../master/screenshots/frontend.png)
![Optional Text](../master/screenshots/backend.png)
