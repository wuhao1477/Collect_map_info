# 这是一个调用地图开发平台的API搜索并转Exls项目

* 实现了三个大平台（百度，腾讯，高德）API的接入，可以快速通过API返回的数据进行整合并转换成Exls表格简单使用
* 暂时够用了，待续......

## 环境需求
* node >= 12.0.1



## 安装

```shell
    npm install 
```

## 进入index.js中配置key

```JavaScript
    const TXKey = ""; //腾讯地图的key，每日配额10000
    const GDKey = ""; //高德地图的key，每日配额100
    const BDKey = "";//百度地图的key，每日配额未知
```

## 运行
```shell
    node index.js
```

## 支持多平台运行
