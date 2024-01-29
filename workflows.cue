package action

import "json.schemastore.org/github"

workflows: [...{
	filename: string
	workflow: github.#Workflow
}]
workflows: [
	{
		filename: "build-and-test.yml"
		workflow: buildAndTest
	},
]

buildAndTest: github.#Workflow & {
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
				uses: "actions/checkout@v4"
			},
			{
				name: "Use node.js 20.x"
				uses: "actions/setup-node@v4"
				with: "node-version": 20
			},
			{
				name: "Use CUE"
				uses: "./"
				with: version: "v0.7.1"
			},
			{
				name: "Check CUE version"
				run:  "cue version"
			},
			{
				name: "Run tests"
				run: """
					npm ci

					"""
			},
			{
				name: "Build"
				run:  "npm run dist"
			},
			{
				name: "Re-vendor GitHub schemas"
				run:  "cue cmd vendorgithubschema"
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
