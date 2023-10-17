/*
 * @Author: Huangjs
 * @Date: 2021-10-21 16:11:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-17 09:22:25
 * @Description: ******
 */

const webpack = require('webpack');
const resolve = require('path').resolve;

const { NODE_ENV, MOD_ENV } = process.env;
const modname = MOD_ENV === 'cjs' ? 'commonjs' : MOD_ENV === 'esm' ? 'module' : 'umd';
const pathname = MOD_ENV === 'cjs' ? 'lib' : MOD_ENV === 'esm' ? 'es' : 'dist';

module.exports = {
  optimization: {
    minimize: NODE_ENV === 'production',
  },
  devtool: 'source-map',
  entry: {
    'slide-view': resolve(__dirname, 'src/index.ts'),
  },
  output: {
    filename: `[name]${NODE_ENV === 'production' ? '.min' : ''}.js`,
    library: {
      name: modname === 'umd' ? 'RawSlideView' : undefined,
      type: modname,
    },
    path: resolve(__dirname, pathname),
  },
  experiments: {
    outputModule: modname === 'module',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude:
          MOD_ENV === 'esm' ? /node_modules/ : /node_modules(?!(\/|\\)(@huangjs888(\/|\\)(.+)?))/,
        use: 'babel-loader',
      },
      // 因为这里使用babel转化ts，所以不需要配置ts-loader
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   use: 'ts-loader',
      // },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: ['web', 'es5'], // webpack构建时候添加的代码片段按照web平台的es5输出
  /* // 不打包@huangjs888/gesture, @huangjs888/gesture/emitter, @huangjs888/lightdom
  externals: {
    '@huangjs888/gesture': {
      commonjs2: '@huangjs888/gesture',
      commonjs: '@huangjs888/gesture',
      amd: '@huangjs888/gesture',
      root: 'RawGesture', // 指向全局变量
    },
    '@huangjs888/gesture/emitter': {
      commonjs2: '@huangjs888/gesture/emitter',
      commonjs: '@huangjs888/gesture/emitter',
      amd: '@huangjs888/gesture/emitter',
      root: 'EventEmitter', // 指向全局变量
    },
    '@huangjs888/lightdom': {
      commonjs2: '@huangjs888/lightdom',
      commonjs: '@huangjs888/lightdom',
      amd: '@huangjs888/lightdom',
      root: 'LightDom', // 指向全局变量
    },
  }, */
  plugins: [new webpack.optimize.AggressiveMergingPlugin()],
};
