import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

/**
 * Build rollup config for development (default) or production (minify = true).
 */
const config = (minify = false) => ({
  input: 'src/index.ts',
  output: {
    file: `umd/mdtocs${minify ? '.min' : ''}.js`,
    format: 'umd',
    name: 'mdtocs',
    sourcemap: true,
  },
  plugins: [typescript({ module: 'es2015' }), minify && terser()],
});

export default [config(), config(true)];
