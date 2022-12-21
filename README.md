# 这是一个调用地图开发平台的 API 搜索并转 Exls 项目

- 实现了三个大平台（百度，腾讯，高德）API 的接入，可以快速通过 API 返回的数据进行整合并转换成 Exls 表格简单使用
- 暂时够用了，待续......

## 环境需求

- node >= 12.0.1

## 安装

```shell
    npm install
```

## 进入 config.js 中配置 key

```JavaScript
    {
        TXKey: "",//腾讯地图的key，每日配额10000,请优先使用腾讯的，使用顺序从上往下
        GDKey: "",//高德地图的key，每日配额100
        BDKey: "",//百度地图的key，每日配额未知
        latitude: "",
        longitude: "",
        Range: "",//范围,不填默认5公里内
    }
```

## 运行

```shell
    node index.js
```

## 支持多平台运行
