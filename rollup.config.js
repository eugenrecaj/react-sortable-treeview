import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
      },
    ],
    external: [
      'react',
      'classnames',
      'prop-types',
      'react-addons-shallow-compare',
      'react-addons-update',
      'react-virtuoso',
    ],
    plugins: [
      postcss({
        plugins: [
          url({
            url: 'inline',
            maxSize: 10,
            fallback: 'copy',
          }),
        ],
        minimize: true,
      }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react'],
        babelHelpers: 'bundled',
      }),
      external(),
      resolve(),
      terser(),
    ],
  },
];
