# YouTube webOS 1 Compatibility Patch

Experimental compatibility fixes for **YouTube AdFree v0.5.3** on older LG TVs using WebKit.

Tested on **LG 55UB9500-CA, webOS 1.4.0-2341, firmware 05.06.10**. The green-button settings menu and ad blocking work on this TV after applying the patch. Compatibility with webOS 2 and other models is **not yet confirmed**.

This is an unofficial patch for [webosbrew/youtube-webos](https://github.com/webosbrew/youtube-webos), related to [issue #160](https://github.com/webosbrew/youtube-webos/issues/160).

## Files

| File | Purpose |
| --- | --- |
| `youtube.leanback.v4_0.5.3-webos1-test.ipk` | Experimental installer |
| `webos1-compatibility.patch` | Changes to upstream v0.5.3 source |
| `sanitized-diagnostics.json` | Relevant runtime errors and regression results |
| `issue-160-report.txt` | Detailed investigation and test notes |

The package still identifies itself as **`youtube.leanback.v4`, version `0.5.3`**. The `webos1-test` filename distinguishes it from the unmodified upstream package.

## Installation

### Requirements

- An LG webOS TV with root access and Homebrew Channel.
- SSH or Telnet access to the TV.
- The test `.ipk` downloaded from this repository.

Rooting instructions are outside this project's scope. See [webOSbrew](https://www.webosbrew.org/rooting/) for device-specific information.

### Install over an existing YouTube AdFree installation

**Do not uninstall the existing app or clear its data first.** This package uses the same app ID, so an in-place installation can retain existing app data. Login preservation cannot be guaranteed on every device.

1. Close YouTube on the TV.
2. Copy the downloaded package to `/tmp/youtube-webos1-test.ipk` on the TV. For example, from a computer with OpenSSH:

   ```sh
   scp -O youtube.leanback.v4_0.5.3-webos1-test.ipk root@TV_IP:/tmp/youtube-webos1-test.ipk
   ```

   Replace `TV_IP` with your TV's local IP address. `-O` uses the older SCP protocol, which can be needed on old TVs. If your SCP client does not support this option, use a compatible file-transfer client.

3. Connect to the TV using SSH, or use its enabled Telnet connection:

   ```sh
   ssh root@TV_IP
   ```

4. Run this command **in the TV's shell**:

   ```sh
   luna-send-pub -w 20000 -i luna://com.webos.appInstallService/dev/install '{"id":"youtube.leanback.v4","ipkUrl":"/tmp/youtube-webos1-test.ipk","subscribe":true}'
   ```

5. Wait for a response containing `"state":"installed"`. If the command remains subscribed after that response, press **Ctrl+C**. If it times out or reports failure, check the installed version and installation error before retrying.
6. Open **YouTube AdFree**, play a video, and press the remote's **green button** to test the settings menu.

Do not replace this package with the unmodified upstream 0.5.3 build on a TV affected by this issue. Because both packages use version `0.5.3`, the version shown in Homebrew Channel alone cannot distinguish them.

### Verify the download

SHA-256 of the included test installer:

```text
55efe14b61daa2247ef756593eefba6b5338c495802fffcad6978f11d0ba0cf5
```

On Windows:

```powershell
Get-FileHash .\youtube.leanback.v4_0.5.3-webos1-test.ipk -Algorithm SHA256
```

### Roll back

Reinstall a known-working package over the same app ID using the installation command above, changing `ipkUrl` to its location on the TV. Avoid uninstalling or clearing app data if you want to retain your login.

The comparison build that worked on the test TV was [v0.3.2-webkit1-legacy.2](https://github.com/SiberianMishka/youtube-webos-legacy/releases/tag/v0.3.2-webkit1-legacy.2).

## What we fixed

Both original 0.5.3 JavaScript bundles passed a compile-only test in the TV's actual WebKit engine. On this device, the observed blockers occurred during runtime initialization.

| Problem observed | Compatibility change |
| --- | --- |
| Configuration initialization throws `Invalid attempt to iterate non-iterable instance` | Use `Map.forEach()` for configuration setup instead of `for...of` and `.keys()` iteration |
| `new DocumentFragment()` is rejected as non-constructible | Use `document.createDocumentFragment()` |
| `EventTarget` is missing | Add a conditional fallback backed by a document fragment |
| `CustomEvent` is exposed but is not a usable constructor | Use `document.createEvent('CustomEvent')` and `initCustomEvent()` when needed |
| `Element.prototype.matches` is missing | Use the available `webkitMatchesSelector` implementation |
| Clean local build resolves the wrong Babel runtime | Explicitly select `@babel/runtime-corejs3` for the async-module transform |

The compatibility module loads before the other userscript modules. Its browser fallbacks are conditional, preserving the existing implementations when they are available.

A minimal Map-iteration probe passed separately on the TV. Therefore, these findings do **not** establish that all Map iteration is broken; a startup/polyfill interaction may underlie the configuration failure.

## Test results

Testing took place on **2026-11-01**.

| Check | Result |
| --- | --- |
| Production webpack build | Passed; bundle-size warnings remain |
| TypeScript project check | Passed |
| ESLint on changed JavaScript/configuration | No errors; upstream configuration skips `userScript.ts`, which TypeScript checked |
| Prettier | Passed |
| ES5 syntax check on both output bundles | Passed |
| Configuration initialization on the TV | Passed |
| Event detail and listener callback context | Passed |
| Event cancellation, duplicate listener suppression and removal | Passed |
| Restart patched app and create v0.5.3 options panel | Passed |
| Previously captured startup TypeError/ReferenceError blockers | Absent from final startup capture |
| Green-button settings menu | Confirmed manually by TV owner |
| Ad blocking | Confirmed manually by TV owner |
| SponsorBlock | Not yet verified |
| Extended playback and all remote-navigation paths | Not yet verified |
| webOS 2 and other TV models | Not yet tested |

The installation was performed in place, without uninstalling YouTube or clearing its app data.

## Known limitations

- This is a test build validated on **one physical webOS 1.4 TV**, not a universal fix for webOS 1/2.
- The EventTarget fallback covers the paths exercised in testing. `event.target` and `event.currentTarget` refer to its backing document fragment, and modern listener options such as `once`, `passive` and `signal` are not implemented.
- A standards-complete event shim or an app-local event abstraction may be preferable before upstream integration.
- YouTube website changes can introduce additional compatibility problems.

## Apply the source patch

The patch targets upstream commit **`d19f2552a306ae81d40bd687b26dce066f6f6389`**, tagged `v0.5.3`.

```sh
git clone --depth 1 --branch v0.5.3 https://github.com/webosbrew/youtube-webos.git
cd youtube-webos
git apply /path/to/webos1-compatibility.patch
```

Use upstream's Node.js and pnpm requirements and its build/package workflow. The patch includes the compatibility source file; this repository's installer was built from that patched source. Consult the [upstream project](https://github.com/webosbrew/youtube-webos/tree/v0.5.3) for build dependencies and licensing.

## Reporting results

Please include your TV model, webOS version, firmware version, and whether the green menu, playback, ad blocking and SponsorBlock work. Include relevant JavaScript errors where possible.

Remove passwords, account details, tokens, serial numbers and network identifiers from anything you share.

## Credits and license

Based on [webosbrew/youtube-webos](https://github.com/webosbrew/youtube-webos), licensed under **GPL-3.0-only**. Preserve the upstream license and third-party notices when redistributing source or installers.

Thanks to the original developers and contributors, and to [SiberianMishka's legacy build](https://github.com/SiberianMishka/youtube-webos-legacy) for a working comparison on old WebKit.
