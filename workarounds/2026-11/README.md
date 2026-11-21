# November 21–22, 2026: restart-loop workaround and responsiveness

Tested on LG 55UB9500-CA, webOS 1.4.0-2341, firmware 05.06.10.

## What changed

YouTube started repeatedly showing its logo, a gray screen, then its logo again. The installed launcher and userscript matched the original test IPK. This is consistent with a new YouTube-side trigger, but its root cause has not been established.

[basman83's report and original keep.js](https://github.com/webosbrew/youtube-webos/issues/160#issuecomment-7062341088) provided the workaround: keep the WebKit inspector Debugger attached to the YouTube page. Credit for that workaround and the included keep.js belongs to basman83. This helper is reproduced unchanged from the attached script.

On our TV, playback and sound worked with the helper attached. The helper started automatically after a reboot, though YouTube restarted before attachment during that test. Startup protection is therefore not guaranteed before Homebrew startup hooks run.

We then removed only the launcher's forced full-animation parameter. The user reported that controls and the video page looked good afterward, with playback, AdFree, fullscreen and the green-button menu working. This is a short manual test, not a performance benchmark or an all-model guarantee.

## Files and scope

- `keep.js`: original crash-only helper; no video sizing changes.
- `startup.sh`: Homebrew startup hook with a PID check.
- `disable.sh`: disables the hook and stops the helper.
- `remove-forced-animation.js`: optional, narrowly targeted launcher edit with a backup and an exact-match check.

The existing IPK and compatibility patch in this repository are unchanged. These additional steps require a rooted TV with Homebrew startup hooks, Node and the existing local WebKit inspector on port 9998. They are not bundled into the IPK.

## Install on the TV

Copy the four files in this folder to `/media/developer/ytaf-debugger-compat/` using your existing TV connection. Run the following in the TV shell:

```sh
chmod 755 /media/developer/ytaf-debugger-compat/disable.sh
cp /media/developer/ytaf-debugger-compat/startup.sh /var/lib/webosbrew/init.d/70-ytaf-debugger-compat
chmod 755 /var/lib/webosbrew/init.d/70-ytaf-debugger-compat
/var/lib/webosbrew/init.d/70-ytaf-debugger-compat
cat /tmp/ytaf-debugger-compat.log
```

Open YouTube. Look for `attached to page N` in the log. Avoid running another copy of the helper.

For the optional responsiveness change, close YouTube, then run:

```sh
/usr/bin/node /media/developer/ytaf-debugger-compat/remove-forced-animation.js
```

Reopen YouTube. The script removes only `env_forceFullAnimation=1`; it leaves voice parameters and the AdFree userscript unchanged. It intentionally refuses an unexpected launcher. It targets the bundled v0.5.3 test build, not arbitrary versions.

## Undo

Disable the debugger workaround:

```sh
/media/developer/ytaf-debugger-compat/disable.sh
```

This may bring the restart loop back. To undo only the animation change:

```sh
cp /media/developer/ytaf-debugger-compat/index-before-animation-test.js /media/developer/apps/usr/palm/applications/youtube.leanback.v4/index.js
```

Close and reopen YouTube afterward. Restore that backup only to the same app version; do not overwrite a later app update with it.

## Important test findings

A temporary fullscreen CSS override initially helped but enlarged the picture beyond the screen when applied persistently. It was removed. **Do not force video width/height to 1920×1080.** The final tested setup uses YouTube's own sizing and contains no fullscreen override.

The debugger workaround may affect performance. Long-duration stability, other TVs and webOS 2 remain unverified. App reinstalls or updates may overwrite the launcher edit. No credentials, TV addresses or private viewing history are included here.
