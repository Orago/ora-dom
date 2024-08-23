import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'src/dom.ts',
	output: {
		// dir: 'dist/',
		file: 'dist/module.js',
		format: 'esm'
	},
	plugins: [
		nodeResolve(),
		typescript({
			tsconfig: './tsconfig.json',
			compilerOptions: {
				rootDir: 'src/'
			}
		})
	]
};