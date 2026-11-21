#!/bin/sh
# YouTube webOS 1.4 crash workaround, tested 2026-11-21.
pidfile=/tmp/ytaf-debugger-compat.pid
if [ -r "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then exit 0; fi
nohup /usr/bin/node /media/developer/ytaf-debugger-compat/keep.js > /tmp/ytaf-debugger-compat.log 2>&1 < /dev/null &
echo $! > "$pidfile"
