import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { dts } from "rollup-plugin-dts";

export default {
	input: "src/index.ts",
	output: {
		// dir: 'dist/',
		file: "dist/umd.d.ts",
		format: 'umd',
	},
	plugins: [
		nodeResolve(),
		// @ts-ignore
		typescript({
			tsconfig: './tsconfig.json',
			compilerOptions: {
				rootDir: 'src/'
			},
			noEmit: true,
			declaration: true,
			removeComments: false
		}),
		dts()
	]
};