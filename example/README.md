<!--
 * @Author: Huangjs
 * @Date: 2023-10-12 14:38:11
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-12 14:53:12
 * @Description: ******
-->

# 运行rawjs示例

npm start

# 运行react示例

npm run react

# 运行UMD示例

直接浏览器打开 public/index_umd.html

# 打包演示示例

npm run docs

# 如何将组件包软链接到测试包，并且不使用重复的react实例（因为组件库和示例都安装了react）

1，进入组件库（slide-view）根目录，创建链接，输入命令：npm link
2，将组建库（slide-view）内的react进行软链接，其实就是把组件库（slide-view）内的 react 引用指向示例（example）内的 react 安装包，输入命令：npm link ./example/node_modules/react（此步不需要，因为库里并未使用react）
2，进入示例（example）目录内（命令：cd ./example），进行软链接本地组件库（slide-view），输入命令：npm link @huangjs888/slide-view


