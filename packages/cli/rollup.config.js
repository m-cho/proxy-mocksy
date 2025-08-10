// packages/cli/rollup.config.js
const typescript = require('@rollup/plugin-typescript');
const copy = require('rollup-plugin-copy');

module.exports = {
  input: 'src/cli.ts',
  output: {
    dir: 'out',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    copy({
      targets: [
        {
          src: '../../README.md', // Source path (root README.md)
          dest: '.'             // Destination directory in the cli package
        }
      ]
    })
  ]
}