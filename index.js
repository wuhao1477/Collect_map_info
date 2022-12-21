const axios = require("axios");
const fs = require("fs");
const json2xls = require("json2xls");
const {
  TXKey,
  GDKey,
  BDKey,
  latitude,
  longitude,
  Range=5000,
} = require("./config.js");
main();
async function main() {
  if(!(latitude&&longitude)){
    return console.log(`请到config.js中完善经纬度数据`);
  }
  if(TXKey){
    let dataList = await getTXMAPdata({ latitude, longitude, Range });
    console.log(dataList);
    let txList = TXSchema(dataList);
    let xls = json2xls(txList);
    fs.writeFileSync(`${Range}米内药店联系方式.xlsx`, xls, "binary");
  }else if(GDKey){
        let dataList = await getGDMAPdata({ latitude, longitude, Range });
    console.log(dataList);
    let GDList = GDSchema(dataList);
    let xls = json2xls(GDList);
    fs.writeFileSync(`${Range}米内药店联系方式.xlsx`, xls, "binary");
  }else if(BDKey){
    
  let dataList = await getBDMAPdata({ latitude, longitude, Range });
  console.log(dataList);
  let BDList = BDSchema(dataList);
  let xls = json2xls(BDList);
  fs.writeFileSync(`${Range}米内药店联系方式.xlsx`, xls, "binary");
  }else{
    console.log(`请到config.js文件下填写任意平台的key`)
  }



}

//百度地图

async function getBDMAPdata({ number, longitude, latitude, Range = 10000 }) {
  number = number <= 20 ? 20 : number;
  if (!number) {
    let response = await BDAPI(longitude, latitude, 1, Range).catch((error) => {
      console.log(error);
      response = false;
    });
    if (response) {
      console.log(response.data);
      if (response.data.status == "0") {
        // console.log(response.data);
        number = response.data.total;
      }
    }
  }
  let dataList = [],
    error_number = 0;
  console.log(number);
  for (let i = 0; i < number / 20; i++) {
    let response = await BDAPI(longitude, latitude, i + 1).catch((error) => {
      console.log(error);
      response = false;
    });
    if (response) {
      if (response.data.status == "0") {
        let data = response.data.results;
        console.log(data);
        if (!data.length) error_number++;
        if (error_number > 5) return dataList;
        dataList = dataList.concat(data);
        await sleep();
      }
    }
  }
  return dataList;
}
async function BDAPI(
  longitude,
  latitude,
  pages,
  Range = 10000,
  keyword = "药店"
) {
  var config = {
    method: "get",
    url: `https://api.map.baidu.com/place/v2/search?ak=${BDKey}&query=${keyword}&location=${latitude},${longitude}&radius=${Range}&page=${pages}&output=json&page_size=20`,
    headers: {},
  };
  return axios(config);
}
function BDSchema(dataList) {
  let jsonArray = [];
  for (let value of dataList) {
    let temp = {
      店铺名: value.name,
      地址: value.address,
      电话: value.telephone || "",
    };
    jsonArray.push(temp);
  }
  return jsonArray;
}

//高德地图
async function getGDMAPdata({ number, longitude, latitude, Range = 10000 }) {
  number = number <= 20 ? 20 : number;
  if (!number) {
    let response = await GDAPI(longitude, latitude, 1, Range).catch((error) => {
      console.log(error);
      response = false;
    });
    if (response) {
      console.log(response.data);
      if (response.data.status == "1") {
        // console.log(response.data);
        number = response.data.count;
      }
    }
  }
  let dataList = [],
    error_number = 0;
  console.log(number);
  for (let i = 0; i < number / 20; i++) {
    let response = await GDAPI(longitude, latitude, i + 1).catch((error) => {
      console.log(error);
      response = false;
    });
    if (response) {
      if (response.data.status == "1") {
        let data = response.data.pois;
        console.log(data);
        if (!data.length) error_number++;
        if (error_number > 5) return dataList;
        dataList = dataList.concat(data);
        await sleep();
      }
    }
  }
  return dataList;
}
async function GDAPI(
  longitude,
  latitude,
  pages,
  Range = 10000,
  keyword = "药店"
) {
  var config = {
    method: "get",
    url: `https://restapi.amap.com/v3/place/text?key=${GDKey}&keywords=${keyword}&location=${longitude},${latitude}&radius=${Range}&offset=20&extensions=all&page=${pages}`,
    headers: {},
  };
  return axios(config);
}
function GDSchema(dataList) {
  let jsonArray = [];
  for (let value of dataList) {
    let temp = {
      店铺名: value.name,
      地址: value.address,
      电话: value.tel,
    };
    jsonArray.push(temp);
  }
  return jsonArray;
}

//腾讯地图
async function getTXMAPdata({ number, longitude, latitude, Range = 10000 }) {
  number = number <= 20 ? 20 : number;
  if (!number) {
    let response = await TXAPI(longitude, latitude, 1, Range).catch((error) => {
      console.log(error);
      response = false;
    });
    if (response) {
      console.log(response.data);
      if (response.data.status == 0) {
        console.log(response.data.data);
        number = response.data.count;
      }
    }
  }
  let dataList = [];
  console.log(number);
  for (let i = 0; i < number / 20; i++) {
    let response = await TXAPI(longitude, latitude, i + 1).catch((error) => {
      console.log(error);
      response = false;
    });
    if (response) {
      if (response.data.status == 0) {
        console.log(response.data.data);
        let data = response.data.data;
        dataList = dataList.concat(data);
      }
    }
  }
  return dataList;
}
async function TXAPI(
  longitude,
  latitude,
  pages,
  Range = 10000,
  keyword = "药店"
) {
  var config = {
    method: "get",
    url: `https://apis.map.qq.com/ws/place/v1/search?key=${TXKey}&keyword=${keyword}&boundary=nearby(${latitude},${longitude},${Range},1)&page_size=20&page_index=${pages}`,
    headers: {},
  };
  return axios(config);
}
function TXSchema(dataList) {
  let jsonArray = [];
  for (let value of dataList) {
    let temp = {
      店铺名: value.title,
      地址: value.address,
      电话: value.tel,
      "与你的距离（米）": value._distance,
    };
    jsonArray.push(temp);
  }
  return jsonArray;
}

function sleep(daley = 1000) {
  return new Promise((resolve) => setTimeout(resolve, daley));
}
