#!/bin/sh
set -eu
[ "$(id -u)" = 0 ] || { echo 'Run this once in the rooted TV shell.'; exit 1; }
[ -x /usr/bin/node ] && [ -d /var/lib/webosbrew/init.d ] || { echo 'Homebrew startup hooks and Node are required.'; exit 1; }
src=/media/developer/apps/usr/palm/applications/youtube.leanback.v4/compat
dst=/media/developer/ytaf-debugger-compat
mkdir -p "$dst"
# Stop only our own recorded helper when reinstalling.
if [ -r /tmp/ytaf-debugger-compat.pid ]; then
  pid=$(cat /tmp/ytaf-debugger-compat.pid)
  if tr '\000' ' ' < /proc/$pid/cmdline 2>/dev/null | grep -q 'ytaf-debugger'; then kill "$pid"; sleep 1; fi
fi
cp "$src/keep.js" "$dst/keep.js"
cp "$src/disable.sh" "$dst/disable.sh"
chmod 755 "$dst/disable.sh"
cp "$src/startup.sh" /var/lib/webosbrew/init.d/70-ytaf-debugger-compat
chmod 755 /var/lib/webosbrew/init.d/70-ytaf-debugger-compat
/var/lib/webosbrew/init.d/70-ytaf-debugger-compat
echo 'Installed. Open YouTube, then check /tmp/ytaf-debugger-compat.log for attached to page N.'
