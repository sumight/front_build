#front_build

## 目录介绍

* src 开发目录
    - images 图片目录
    - js js目录
    - less less和CSS文件目录，编译后不存在，编译出来的CSS文件放在CSS目录中
    - partial html代码片段目录
    - tpl 模板目录
* dist 开发环境发布目录
* public 生产环境发布目录

## 当前构建的功能

* browserify js打包
* less 编译
* dot 预编译
* sprite 图片合并
* browsersync 调试服务
* html片段

### js打包

### dot预编译

### sprite

### browsersync 调试服务
browsersync 调试服务的功能很强大，支持多端调试。具体功能请访问官网（中文哦）。

### html片段
使用 ```@@include('./partial/footer.html')```将代码片段引入

开启调试服务后，自动打开浏览器，访问本地服务器。每次修改文件之后，会自动发布，并且刷新浏览器

背景图片默认不会进行sprite合并，如果需要进行合并如下加上注解
```css
    /* @meta {"spritesheet": {"include": true}} */
    background-image: url('../images/a.png');
```
需要注意的是sprite的背景图片只适合容器和背景图片大小相同的情况。而且，如果在手机使用rem作为单位，也避免使用sprite。因为sprite定位是以像素为单位，使用rem确定容器大小会出现偏差。

## 命令使用

```shell
$ gulp 
```
发布到开发环境，这个时候js文件会被映射，且不会被压缩。

```shell
$ gulp watch
```
发布到开发环境，且文件的变化会被监控，当文件改变的时候会自动发布

```shell
$ gulp public
```
发布到生产环境，这个时候js和css被压缩

```shell
$ gulp server
```
开启本地调试服务器，本地服务器会在开发目录改变的适合自动同步到浏览器，默认采用chrome浏览器打开