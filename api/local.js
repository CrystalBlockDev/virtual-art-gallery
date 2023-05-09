"strict mode";

const $ = require("jquery");

// Local images
const images = require("../images/images.json").images.map((img, i) => ({
  ...img,
  image_id: i,
}));
let getParamValue = function () {
  var url = window.location.search.substring(1); //get rid of "?" in querystring
  var qArray = url.split("&"); //get key-value pairs
  let result = {};
  for (var i = 0; i < qArray.length; i++) {
    var pArr = qArray[i].split("="); //split key and value
    result[pArr[0]] = pArr[1];
  }
  return result;
};

module.exports = {
  fetchList: async function (from, count) {
    // return images.slice(from, from + count);//.map((img,i)=>({...img, image_id:i+from}));
    const parseData = getParamValue();
    parseData.param = JSON.parse(
      `"${parseData.param.replaceAll("%22", '\\"')}"`
    );

    const res = await $.ajax({
      type: "POST",
      url: parseData.url,
      data: parseData.param,
      headers: { "Content-Type": "application/json" },
    });

    if (res.code === 0) {
      let result = [];
      for (var i = 0; i < 150; i++) {
        const nft = res.data[i % res.data.length];
        result.push({
          file: `${
            nft.fileType === 1 ? parseData.ipfsGateway : parseData.upload
          }${nft.logoURL}`,
          title: nft.description,
        });
      }

      const data = result
        .slice(from, from + count)
        .map((img, i) => ({ ...img, image_id: i }));

      return data;
    } else {
      alert("Sphere View load error");
      return [];
    }
  },
  fetchImage: async function (obj, advicedResolution) {
    const url = obj.file;
    const blob = await fetch(url).then((res) => res.blob());
    return {
      title: obj.title,
      image: blob,
    };
  },
};
