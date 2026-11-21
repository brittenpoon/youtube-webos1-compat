# 0.5.3-devmode.1 — Developer Mode two-IPK test release

Install BOTH IPKs using your usual Developer Mode installer (for example webOS Dev Manager), then open **YouTube AdFree Compat** each time you want to use YouTube.

- youtube.leanback.v4_0.5.3-devmode.1_all.ipk — YouTube AdFree, internal version 0.5.3.
- org.ytaf.compatlauncher_0.1.2_all.ipk — companion launcher and crash-workaround service.

No root setup or root startup hook is required by this bundle. Keep Developer Mode active. Opening the original YouTube icon directly does not start the companion helper. The helper stops after approximately two minutes without a YouTube page.

This retains the working two-package arrangement: original NetCast app behavior for AdFree and the green-button menu, native video sizing, and the debugger crash workaround. The forced full-animation launch option is removed to improve controls on old hardware. No fullscreen CSS override is included. The failed single-IPK experiment is NOT included.

Playback/sound, AdFree, fullscreen at different resolutions, navigation and the green-button menu were confirmed by the tester on webOS 1.4 with the two-package arrangement. The final YouTube package restores version metadata to 0.5.3 and preserves the original userscript without further minification. The companion ran as a non-root service with the old root helper disabled. The test TV itself is rooted and root access was used for diagnostic/install transport; a completely unrooted TV and webOS 2 have not yet been independently validated. This is therefore a prerelease.

If you previously installed the older root-helper release, disable that helper before using this launcher to avoid competing debugger sessions. Ordinary Developer Mode users do not need that migration step.

Credits: [webosbrew/youtube-webos](https://github.com/webosbrew/youtube-webos), the existing webOS 1 compatibility work in this repository, and [basman83's debugger workaround report](https://github.com/webosbrew/youtube-webos/issues/160#issuecomment-7062341088).
