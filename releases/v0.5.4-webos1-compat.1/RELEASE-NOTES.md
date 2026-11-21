# Experimental webOS 1 compatibility update — 2026-11-22

Download `youtube.leanback.v4_0.5.4_all.ipk`. Package version 0.5.4 identifies this compatibility repack; it is not an upstream webosbrew release.

## Install
1. Install the IPK with your existing webOS installer. It updates app ID `youtube.leanback.v4`.
2. **For the November restart loop, a rooted TV is required.** Run this once in the TV's root shell:
   `sh /media/developer/apps/usr/palm/applications/youtube.leanback.v4/compat/setup.sh`
3. Open YouTube. Check `cat /tmp/ytaf-debugger-compat.log` for `attached to page N`.

Installing the IPK alone does NOT activate the crash workaround. The helper requires Homebrew startup hooks, /usr/bin/node and the local WebKit inspector on port 9998. If basman83's helper is already installed under another name, disable that copy first; do not run two debugger helpers.

## Included
- Original tested v0.5.3 compatibility userscript, unchanged.
- Only the forced full-animation launcher parameter removed.
- Bundled original debugger helper from [basman83](https://github.com/webosbrew/youtube-webos/issues/160#issuecomment-7062341088), startup hook, setup and disable scripts.
- No fullscreen CSS override.

## Validation and limitations
On LG 55UB9500-CA / webOS 1.4.0-2341 / firmware 05.06.10, the existing installation with these runtime changes was manually tested: playback, sound, AdFree, green-button settings and different video resolutions worked. Controls improved after removing forced animations.
The newly repackaged IPK passed package metadata inspection; its AdFree bundle matches the tested installation. **The new IPK itself has not yet been installed on a TV.**
webOS 2, other models and extended stability are unverified. Treat this as a test release.
The helper auto-started after reboot during testing, but YouTube restarted before it attached. Protection before Homebrew startup finishes is not guaranteed. The debugger can still affect performance.

## Rollback
Run `sh /media/developer/ytaf-debugger-compat/disable.sh` to disable the helper (the crash loop may return). Reinstall the previous IPK to undo the launcher change; some installers may require uninstalling the newer version first, which can lose app settings.

SHA-256: `1db88c9c25f1f5933734cc1466f988eb669456ab35e719a38b9b08bf553b7707`

See [workaround details](https://github.com/brittenpoon/youtube-webos1-compat/tree/main/workarounds/2026-11). Thanks to basman83 and the upstream developers.
