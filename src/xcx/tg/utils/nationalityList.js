var nationalityList = national()

function national() {
  var arr = {
    list: [{
        id: 1,
        national: "中国"
      },
      {
        id: 2,
        national: "美国"
      },
      {
        id: 3,
        national: "俄罗斯"
      },
      {
        id: 4,
        national: "印度"
      }
    ]
  }
  return arr
}
module.exports = {
  national: national
}