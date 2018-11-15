Page({
  data: {
    "wholeCfg": {
      "tagMutexLabels": [
        {
          "id": "0",
          "title": "Qualified or Unqualified?",
          "labels": [
            {
              "name": "Qualified",
              "content": "选项含义"
            },
            {
              "name": "Unqualified",
              "content": "选项含义"
            }
          ]
        }
      ],
      "tagNormalLabels": [
        {
          "id": "0",
          "title": "图中出现的动物",
          "labels": [
            {
              "name": "狗",
              "content": "选项含义"
            },
            {
              "name": "猫",
              "content": "选项含义"
            }
          ]
        },
        {
          "id": "0",
          "title": "图中出现的颜色",
          "labels": [
            {
              "name": "白",
              "content": "选项含义"
            },
            {
              "name": "黑",
              "content": "选项含义"
            },
            {
              "name": "黄",
              "content": "选项含义"
            }
          ]
        }
      ]
    },
    "itemCfg": {
      "tagMutexLabels": [
        {
          "id": "0",
          "title": "Subject Kind",
          "labels": [
            {
              "name": "Line",
              "content": "选项含义"
            },
            {
              "name": "Pet",
              "content": "选项含义"
            },
            {
              "name": "Pet Dung",
              "content": "选项含义"
            },
            {
              "name": "Human",
              "content": "选项含义"
            },
            {
              "name": "Waterlogging",
              "content": "选项含义"
            },
            {
              "name": "Carpet",
              "content": "选项含义"
            }
          ]
        }
      ]
    },
    "Restrictions": {
      "SopType": 5002,
      "CollectRest": {
        "amount": 3
      }
    },
    selectMutex: [], // 用户输入参数
    selectNormal: [], // 用户输入参数
    index: 0,
    id: 0,
    title: ''
  },
  choiceTagMutex: function (e) {
    this.data.selectMutex = e.detail.value;
  },
  choiceTagNormal: function (e) {
    this.data.index = e.currentTarget.dataset.index;
    this.data.title = e.currentTarget.dataset.title;
    this.data.selectNormal[this.data.index] = "第" + this.data.index + "题：" + this.data.title + "：" + e.detail.value;
  },
  submit: function () {
    if (this.data.selectMutex.length === 0) {
      wx.showToast({
        title: "请至少选择一项",
        icon: "loading",
        duration: 1500
      });
    } else if (this.data.selectNormal.length === 0) {
      wx.showToast({
        title: "请至少选择一项",
        icon: "loading",
        duration: 1500
      });
    } else {
      var sumbitinfo = {}
      sumbitinfo.selectMutex = this.data.selectMutex;
      sumbitinfo.selectNormal = this.data.selectNormal;
      console.log(sumbitinfo)
    }
  }
});
