# `setup-cue`

***Install a specific [CUE](https://cuelang.org) CLI version on your Github
Actions runner***

You want to use this action in your github actions workflow to install a
specific version of [CUE](https://cuelang.org) on your runner. `version` is a
semantic version string like `v0.4.0`. You can also use the keyword `latest`
(default) to use the latest stable release of `cue`. Releases of `cue` are
listed [here](https://github.com/cue-lang/cue/releases).

```
- uses: cue-lang/setup-cue@v1
  with:
    version: '<version>' # default is latest
  id: install
```

Please refer to the `actions.yml` file for details about all the inputs. The
cached `cue` binary path is prepended to the `PATH` environment variable and can
be executed directly in further workflow steps. It is also stored in the
`cuectl-path` output variable.

## Contributing

This project welcomes contributions or suggestions of any kind. Please feel free
to create an issue to discuss changes or create a Pull Request if you see room
for improvement.

## Thanks

An initial version of this project was graciously donated to the CUE project by
[Christian Bargmann](https://github.com/cbrgm) and the folks from [MOIA
GmbH](https://github.com/moia-oss).
