const rollup = require("rollup");
const build = require("./lib/buildFuncs");
const getSport = require("./lib/getSport");
const rollupConfig = require("./lib/rollupConfig");

console.log("Bundling JavaScript files...");

const rev = build.genRev();
console.log(rev);

const sport = getSport();

const BLACKLIST = {
	ui: [/\/worker/],
	worker: [/\/ui/, /^react/],
};

(async () => {
	try {
		await Promise.all(
			["ui", "worker"].map(async name => {
				const bundle = await rollup.rollup({
					...rollupConfig("production", BLACKLIST[name], `stats-${name}.html`),
					input: `src/${sport}/${name}/index.ts`,
				});

				await bundle.write({
					file: `build/gen/${name}-${rev}.js`,
					format: "iife",
					indent: false,
					name,
					sourcemap: true,
				});
			}),
		);

		build.setTimestamps(rev);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
