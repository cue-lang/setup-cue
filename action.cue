package action

import "json.schemastore.org/github"

action: github.#Action & {
	name:        "Setup CUE environment"
	description: "Setup a CUE environment and add it to the PATH."
	inputs: version: {
		description: #"The CUE version to setup. Must be a valid version string like "v0.6.0", or "latest""#
		required:    true
		default:     "latest"
	}
	outputs: "cue-path": description: "Path to the cached CUE binary"
	branding: {
		icon:  "terminal"
		color: "blue"
	}
	runs: {
		using: "node16"
		main:  "dist/index.js"
	}
}
