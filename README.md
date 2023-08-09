# `setup-cue`

***Install a specific [CUE](https://cuelang.org) CLI version on your GitHub
Actions runner***

Use this action in your GitHub Actions workflow to install a specific version of
[CUE](https://cuelang.org) on your runner. The input `version` is a
[version](https://go.dev/ref/mod#versions) string like `v0.6.0`, or
`v0.6.0-beta.1`. You can also use the version query `latest` (default) to use
the latest release of `cue`. Releases and pre-releases of `cue` are listed
[here](https://github.com/cue-lang/cue/releases).

```
- uses: cue-lang/setup-cue@v1.0.0
  with:
    version: '<version>' # default is latest
  id: install
```

The input and output schemas are best described using CUE itself:

```cue
#inputs: {
	// Version of CUE
	version: *"latest" | string
}

#outputs: {
	// Path to the cached CUE binary
	"cuectl-path": string
}
```

Please refer to [`action.yml`](action.yml) for more details.

The cached `cue` binary path is prepended to the `PATH` environment variable and
can be executed directly in later workflow steps. It is also stored in the
`cuectl-path` output variable.

## Issues/Discussions

Please use the [main CUE repository](https://github.com/cue-lang/cue/issues) to
raise issues or start discussions about the `setup-cue` action.

## Contributing

This project follows the [CUE Contribution
Guide](https://github.com/cue-lang/cue/blob/master/CONTRIBUTING.md).

## Thanks

An initial version of this project was graciously donated to the CUE project by
[Christian Bargmann](https://github.com/cbrgm) and the folks from [MOIA
GmbH](https://github.com/moia-oss).
