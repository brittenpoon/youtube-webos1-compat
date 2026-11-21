# Developer Mode companion source

Package the launcher and service together with the webOS CLI:

```
ares-package -n devmode/app devmode/service -o dist
```

For the YouTube IPK, unpack the repository's original 0.5.3 webOS 1 test IPK. In index.js remove the single expression `t.searchParams.append("env_forceFullAnimation","1"),`. Keep appinfo.json version 0.5.3, the original app ID and NetCast metadata. Repackage the application directory with `ares-package -n`; do not minify the already-built scripts again. The original webOSUserScripts/userScript.js MD5 is d568dd92152736995da8dc2ee15bef6c.

The companion uses a normal webOS JavaScript service and refuses UID 0. It starts the debugger workaround before launching the original YouTube app. It does not inject userscripts or change video sizing. See release notes for validation limits and basman83's original workaround credit.
