import { parse } from "https://deno.land/std/flags/mod.ts"
import { resolve } from "https://deno.land/std/path/mod.ts"
import { walk, WalkOptions } from "https://deno.land/std/fs/mod.ts"

async function main(args: string[]) {
	const {
		type,
		name,
		_not,
		_help,
		_: [dir = "."],
	} = parse(args)
	const dirFullPath = resolve(Deno.cwd(), String(dir))
	let includeFiles = true
	let includeDirs = true
	const types = type ? (Array.isArray(type) ? type : [type]) : ["f", "d"]

	if (!types.includes("f")) {
		includeFiles = false
	}

	if (!types.includes("d")) {
		includeDirs = false
	}

	const matchRegexp: RegExp[] | undefined = name
		? (Array.isArray(name) ? name : [name]).map((reg: string) => new RegExp(reg))
		: undefined

	const options: WalkOptions = {
		maxDepth: 2,
		includeFiles,
		includeDirs,
		followSymlinks: false,
		match: matchRegexp,
		skip: [/node_modules/g],
	}

	for await (const entry of walk(dirFullPath, options)) {
		console.log(entry.path)
	}
}

main(Deno.args)
