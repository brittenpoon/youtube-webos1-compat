#!/bin/sh
if [ -f /var/lib/webosbrew/init.d/70-ytaf-debugger-compat ]; then
  mv /var/lib/webosbrew/init.d/70-ytaf-debugger-compat /media/developer/ytaf-debugger-compat/startup.disabled
fi
if [ -r /tmp/ytaf-debugger-compat.pid ]; then
  pid=$(cat /tmp/ytaf-debugger-compat.pid)
  if tr '\000' ' ' < /proc/$pid/cmdline 2>/dev/null | grep -q 'ytaf-debugger'; then kill "$pid"; fi
fi
