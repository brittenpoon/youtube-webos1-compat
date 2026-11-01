# YouTube webOS 1 compatibility fix

Investigation of [webosbrew/youtube-webos#160](https://github.com/webosbrew/youtube-webos/issues/160), based on **v0.5.3**.

Test device: **LG 55UB9500-CA**, webOS **1.4.0-2341**, firmware **05.06.10**.

## Findings and changes

The original bundles pass the TV's JavaScript parser, but fail during startup:

| Runtime problem | Change |
| --- | --- |
| Non-iterable error during configuration setup | Replace configuration `for...of` / `Map.keys()` loops with `Map.forEach()` |
| `DocumentFragment` is not constructible | Use `document.createDocumentFragment()` |
| Missing `EventTarget` | Provide a compatible event implementation |
| `CustomEvent` is not constructible | Fall back to `createEvent()` / `initCustomEvent()` |
| Missing `Element.matches()` | Fall back to `webkitMatchesSelector` |

The local build also needed `moduleName: '@babel/runtime-corejs3'` in the async-module transform's runtime options.

## Results

After patching, the **green-button menu and ad blocking work** on this TV. Build, TypeScript, formatting and ES5 syntax checks passed. The captured startup errors are gone.

SponsorBlock, extended playback, webOS 2 and other models remain untested. The current EventTarget fallback is experimental; a standards-complete implementation would be preferable upstream.

See [source patch](webos1-compatibility.patch) and [sanitized diagnostics](sanitized-diagnostics.json).

Based on [youtube-webos](https://github.com/webosbrew/youtube-webos), GPL-3.0-only. The [legacy build](https://github.com/SiberianMishka/youtube-webos-legacy) provided a working comparison.
