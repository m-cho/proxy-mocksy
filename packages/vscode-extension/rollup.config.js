// packages/vscode-extension/rollup.config.js
const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const path = require('path');

module.exports = {
  input: 'src/extension.ts',
  output: {
    dir: 'out',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
  external: (id) => {
    const internalPackagesPrefix = '@proxy-mocksy/';

    return id.includes('node_modules') && !id.includes(`node_modules/${internalPackagesPrefix}`);
  }
};