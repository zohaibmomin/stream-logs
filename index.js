/**
 * Author: Zohaib Ali Momin
 * Description: Streaming Log Module.
 */
var http = require("http"),
  io = require("socket.io"),
  fs = require("fs"),
  url = require("url");

var StreamLog = function (filename, port, lineCount) {
  console.log(filename);
  var server = http.createServer(function (req, res) {
    var parsedQuery = url.parse(req.url, true).query;

    if (parsedQuery["offset"]) {
      console.log(parsedQuery);

      var offset = parseInt(parsedQuery["offset"], 10),
        from = offset > lineCount ? offset - lineCount : 0;

      console.log("RANGE OF LINES ARE FROM " + from + " TO " + offset);

      // push live content to the subscribed clients
      pushLiveData(from, offset, function (lines) {
        res.writeHead(200, { "Conent-Type": "application/json" });
        res.end(
          JSON.stringify({
            tail: lines,
            lastModifiedPos: from
          })
        );
      });
    } else {
      // 200- Status OK to serve front-end scroller
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile(__dirname + "/index.html", function (err, data) {
        console.log("Served file index.html")
        res.end(data, "utf8");
      });
    }
  });

  server.listen(port, null);
  console.log("Server Running :)");

  function pushLiveData(from, to, callback) {
    var stream = fs.createReadStream(filename, {
      start: from,
      end: to
    });

    stream.addListener("data", function (lines) {
      lines = lines.toString("utf-8");
      lines = lines.slice(lines.indexOf("\n") + 1).split("\n");
      callback(lines);
    });
  }

  // Setup Socket IO
  io = io.listen(server);

  io.sockets.on("connection", function (client) {
    console.log("connected");
    fs.stat(filename, function (err, stats) {
      if (err) throw err;
      var from = stats.size > lineCount ? stats.size - lineCount : 0;
      // let from = 0;
      console.log("from", from);
      console.log("stats", stats);
      pushLiveData(from, stats.size, function (lines) {
        client.emit("message", {
          filename: filename,
          tail: lines,
          lastModifiedPos: from
        });
      });
    });
  });

  // watch and monitor the file now
  fs.watchFile(filename, function (curr, prev) {
    if (prev.size > curr.size) return { clear: true };

    var stream = fs.createReadStream(filename, {
      start: prev.size,
      end: curr.size
    });

    stream.addListener("data", function (lines) {
      io.sockets.emit("message", {
        tail: lines.toString("utf-8").split("\n")
      });
    });
  });

  io.configure(function () {
    io.disable("log");
  });
};

module.exports = StreamLog;
// var argv = require('optimist')
//    .usage('Usage: stream-log --file <filename>')
//    .demand(['file'])
//    .default('port', 3000)
//    .default('lineCount', 1000)
//    .argv;

// var StreamLog = StreamLog(argv.file, argv.port, argv.lineCount);
