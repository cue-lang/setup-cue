# setup-cue

A GitHub Action which installs a CUE release on a runner and adds it to `PATH`.
The action is TypeScript, bundled into a single JavaScript file which GitHub
runs directly from this repository.

## Layout

    src/run.ts       the action's implementation
    __tests__/       jest tests
    dist/index.js    the bundle GitHub actually runs; generated, committed
    action.cue       the action definition; generates action.yml
    workflows.cue    the CI workflow definition; generates .github/workflows/
    *_tool.cue       the cue commands which write the generated files

`dist/index.js`, `action.yml` and `.github/workflows/*.yml` are all generated.
Never edit them by hand; change the source and re-run the generator below.

## Developing

    npm ci
    npm test
    npm run dist                # regenerate dist/index.js
    cue cmd genaction           # regenerate action.yml from action.cue
    cue cmd genworkflows        # regenerate .github/workflows from workflows.cue

CI runs all of the above and then fails if the tree is dirty, so any commit
touching `src/` or a `.cue` file must include its regenerated output.

Inputs and outputs are declared in `action.cue` and consumed by name in
`src/run.ts`; nothing enforces that the two agree at build time, so a test
reads the names back out of `action.yml`. Keep it that way.

## Versioning

Follow semver, and bump the major version whenever a workflow which worked on
the previous tag might stop working:

* raising the node runtime in `action.cue`, since it requires a newer Actions
  Runner than some self-hosted and Enterprise Server installations have
* renaming or removing an input or output
* dropping support for a CUE version or platform

Each major version has a moving tag, `v1` and `v2`, pointing at the newest
release of that major. Users are expected to reference those rather than exact
tags. `v1` is pinned to v1.0.1 and runs on node20, which runners no longer
provide as of 2026-09-23; it is kept only so existing references resolve.

## Releasing

1. Check CI is green on `main`.
2. Update the README's `uses:` line and `package.json`'s version.
3. Tag the release and move the major tag:

       git tag -a vX.Y.Z -m vX.Y.Z && git push origin vX.Y.Z
       git tag -f vX vX.Y.Z && git push -f origin vX

4. Publish a GitHub release whose notes lead with anything breaking, naming
   the runner version required if the node runtime changed.

Issues and discussions live in the main cue-lang/cue repository, not here.
