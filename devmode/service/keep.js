var status = exports.status = {attached:false,lastError:null,polls:0};
// Keeps the WebKit inspector Debugger attached to YouTube to avoid a JSC JIT crash on webOS 1.x
var http = require('http'), net = require('net'), crypto = require('crypto');
var absentPolls = 0;
var PORT = 9998, current = null, sock = null;
function log(m) { console.log(new Date().toISOString() + ' ' + m); }
function frame(str) {
  var p = new Buffer(str, 'utf8'), len = p.length, hdr;
  if (len < 126) { hdr = new Buffer(2); hdr[1] = 0x80 | len; }
  else { hdr = new Buffer(4); hdr[1] = 0x80 | 126; hdr.writeUInt16BE(len, 2); }
  hdr[0] = 0x81;
  var mask = crypto.randomBytes(4), out = new Buffer(len);
  for (var i = 0; i < len; i++) out[i] = p[i] ^ mask[i % 4];
  return Buffer.concat([hdr, mask, out]);
}
function attach(id) {
  var key = crypto.randomBytes(16).toString('base64'), upgraded = false;
  var s = net.connect(PORT, '127.0.0.1', function () {
    s.write('GET /devtools/page/' + id + ' HTTP/1.1\r\nHost: 127.0.0.1:' + PORT +
      '\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ' + key +
      '\r\nSec-WebSocket-Version: 13\r\n\r\n');
  });
  s.on('data', function (d) {
    if (!upgraded) {
      if (d.toString('binary').indexOf(' 101 ') < 0) { log('upgrade failed'); s.destroy(); return; }
      upgraded = true;
      s.write(frame('{"id":1,"method":"Debugger.enable"}'));
      s.write(frame('{"id":2,"method":"Debugger.setPauseOnExceptions","params":{"state":"none"}}'));
      status.attached=true;status.page=id;log('attached to page ' + id);
    }
    // ignore everything else
  });
  function gone(why) { status.attached=false;status.lastError=why; if (sock === s) { sock = null; current = null; log('detached: ' + why); } }
  s.on('close', function () { gone('close'); });
  s.on('error', function (e) { gone('error ' + e.message); });
  sock = s; current = id;
}
function poll() {
  var req = http.get({ host: '127.0.0.1', port: PORT, path: '/pagelist.json' }, function (res) {
    var b = '';
    res.on('data', function (c) { b += c; });
    res.on('end', function () {
      status.polls++;var pages = [];
      try { pages = JSON.parse(b); } catch (e) {}
      var yt = null;
      for (var i = 0; i < pages.length; i++)
        if ((pages[i].url || '').indexOf('youtube.com/tv') >= 0) yt = pages[i].id;
      if (yt === null) { absentPolls++; if (absentPolls >= 60) process.exit(0); } else { absentPolls = 0; }
      if (yt !== null && current !== yt) {
        if (sock) { sock.destroy(); sock = null; }
        attach(yt);
      } else if (yt === null && sock) { sock.destroy(); sock = null; current = null; }
    });
  });
  req.on('error', function (e) { status.lastError=e.message; });
  req.setTimeout(3000, function () { req.abort(); });
}
log('started');
setInterval(poll, 2000);
poll();
