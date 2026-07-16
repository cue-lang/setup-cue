package action

import "cue.dev/x/githubactions"

workflows: [...{
	filename: string
	workflow: githubactions.#Workflow
}]
workflows: [
	{
		filename: "build-and-test.yml"
		workflow: buildAndTest
	},
]

buildAndTest: githubactions.#Workflow & {
	name: "build and test"
	on: {
		pull_request: types: [
			"opened",
			"synchronize",
		]
		push: branches: [
			"main",
		]
	}

	jobs: build: {
		"runs-on": "ubuntu-latest"
		steps: [
			{
				name: "Checkout"
				uses: "actions/checkout@v7"
			},
			{
				name: "Use node.js 24.x"
				uses: "actions/setup-node@v7"
				with: "node-version": 24
			},
			{
				name: "Use CUE"
				uses: "./"
				with: version: "v0.17.1"
			},
			{
				name: "Check CUE version"
				run:  "cue version"
			},
			{
				name: "Run tests"
				run: """
					npm ci
					npm test

					"""
			},
			{
				name: "Build"
				run:  "npm run dist"
			},
			{
				name: "Re-gen GitHub Action schema"
				run:  "cue cmd genaction"
			},
			{
				name: "Re-gen GitHub Actions workflows"
				run:  "cue cmd genworkflows"
			},
			{
				name: "Check commit clean"
				run:  "test -z \"$(git status --porcelain)\" || (git status; git diff; false)"
			},
		]
	}
}
