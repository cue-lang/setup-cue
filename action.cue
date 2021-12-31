package action

action: {
	name:        "Setup CUE environment"
	icon:        "terminal"
	description: "Setup a Go environment and add it to the PATH."
	inputs: version: {
		description: #"The CUE version to setup. Must be a valid semantic version string like "v0.4.0" or "latest""#
		required:    true
		default:     "latest"
	}
	outputs: "cue-path": description: "Path to the cached CUE binary"
	branding: color: "blue"
	runs: {
		using: "node12"
		main:  "dist/index.js"
	}
}
