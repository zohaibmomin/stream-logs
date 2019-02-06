Streaming Logs
=========

stream-log is a simple utility to allow you to watch a remote file in realtime on your browser via websockets.

Features
========

* Transmitting the updates to the users browser using Websockets
* Infinite upward scroll simulates terminal application

Install and Run
===============

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


