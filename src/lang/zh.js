import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
export default {
  ...zhLocale,
  navbar: {
    title: '泛函数据平台',
    project: '项目',
    help: '帮助',
    register: '注册',
    login: '登录',
    logout: '退出登录',
    workbench: '工作台',
    ucenter: '个人中心',
    notHaveAccount: '还没账号？',
    haveAccount: '已有账号？',
    js: {
      success: '成功'
    }
  },
  footer: {
    title: '泛函科技'
  },
  sendmail: {
    title1: '联系方式一：通过以下两种联系方式与我们联系',
    contactPhone: '联系电话：0086512-6813-8573',
    contactMail: '联系邮箱：fanhan@fanhantech.com',
    title2: '联系方式二：在线填写邮件（适用于拥有PC邮箱客户端的用户）',
    name: '姓名',
    mail: '邮箱',
    phone: '电话号码',
    message: '任务描述',
    send: '使用客户端发送',
    js: {
      name: '姓名',
      mail: '邮箱',
      phone: '联系电话',
      message: '任务描述',
      title: '定制任务',
      rule: '请确认信息是否填写完毕'
    }
  },
  register: {
    title: '注册账号',
    username: '用户名',
    mobile: '手机号',
    code: '请输入手机验证码',
    password: '请输入密码',
    confirm: '请确认密码',
    email: '邮箱',
    agree: '我同意遵守',
    agreement: '《泛函用户服务协议》',
    register: '注册',
    js: {
      error: '失败',
      success: '成功',
      sendAgain: '重新发送',
      send: '发送验证码'
    }
  },
  login: {
    title: '登录泛函标注平台',
    username: '用户名',
    password: '请输入密码',
    remember: '记住我',
    forgot: '找回密码',
    login: '登录',
    // 这里有增加
    socialAccount: '社交账号登录',
    js: {
      error: '失败',
      success: '成功'
    }
  },
  // 这里有增加
  oauth: {
    connected: '关联平台账号',
    perfectInfo: '完善账号信息',
    agree: '登录即表示您同意',
    confirm: '确定',
    haveAccount: '已有用户名？',
    noAccount: '没有平台账号'
  },
  validator: {
    username: {
      rule1: '请输入用户名',
      rule2: '用户名至少为 5 位字符',
      rule3: '用户名最多为 30 位字符',
      rule4: '用户名须以字母开头，且只能包含字母、数字、横线及下划线',
      rule5: '用户名已存在',
      rule6: '用户名不存在'
    },
    name: {
      rule1: '请输入用户名/邮箱',
      rule2: '请输入正确的用户名/邮箱'
    },
    email: {
      rule1: '请输入邮箱地址',
      rule2: '请输入正确的邮箱地址'
    },
    password: {
      rule1: '请输入密码',
      rule2: '密码长度至少6位'
    },
    confirm: {
      rule1: '请再次输入密码',
      rule2: '两次输入密码不一致!'
    },
    mobile: {
      rule1: '请输入手机号',
      rule2: '手机号码已存在',
      rule3: '请输入正确手机号，目前只支持中国大陆的手机号码',
      rule4: '手机号码不存在'
    },
    code: {
      rule1: '请输入手机验证码',
      rule2: '请输入正确验证码'
    },
    agree: {
      rule1: '请勾选同意协议'
    }
  },
  collectWav: {
    equip: '选择设备',
    name1: '真实姓名',
    name2: '请输入真实姓名',
    address1: '录音对象国籍',
    address2: '请输入录音对象国籍',
    language1: '选择语言',
    language2: '请选择',
    upload1: '上传音频',
    upload2: '将文件拖到此处，或',
    upload3: '点击上传',
    upload4: '只能上传一个wav格式的音频文件，且不超过500Mb',
    submit: '提交',
    reset: '重置',
    js: {
      rules: {
        equip: '设备不能为空',
        name: '真实姓名不能为空',
        address: '录音对象国籍不能为空',
        language: '必须选择语言'
      },
      error: {
        type1: '失败',
        type2: '还没有上传文件',
        type3: '文件太大',
        type4: '上传失败，请刷新重试！',
        type5: '确定移除'
      },
      success: {
        type1: '成功',
        type2: '上传成功'
      }
    }
  },
  pushTask: {
    creat: '创建任务',
    business: '业务信息',
    baseinfo: '详细信息',
    qcprice: '设置报价',
    sample: '填写样例',
    tutorial: '教程',
    note1: '模板不满意？',
    note2: '我要定制专属服务！',
    goback: '上一步',
    submit: '保存',
    next: '下一步',
    js: {
      success: '成功',
      successNote: '提交成功',
      error: '失败'
    }
  },
  selectProjectType: {
    voice: '语音任务',
    image: '图片任务',
    text: '文本任务',
    video: '视频任务',
    voiceCut: '语音切割',
    voiceCutNote: '按要求从长音频中截取音频段',
    voiceTags: '语音标注',
    voiceTagsNote: '按要求对音频进行标注',
    voiceEdit: '语音转写',
    voiceEditNote: '将听到的音频转写为文字',
    imageWhole: '整图识别',
    imageWholeNote: '整图识别',
    imageRule: '规则图形标注',
    imageRuleNote: '使用规则图形（矩形，圆等）在图中进行标注',
    imageIrregular: '不规则图形标注',
    imageIrregularNote: '使用不规则图形（多边形，描点等）在图中进行标注',
    imageSimpleRect: '简单拉框任务',
    imageSimpleRectNote: '仅拉框的任务（可通过颜色区分类别）',
    textTranslate: '文本翻译',
    textTranslateNote: '将一种语言翻译为另一种',
    textCouplet: '对句',
    textCoupletNote: '构建一问一答的对话',
    textTags: '分词标注',
    textTagsNote: '语句分词及词性标注',
    textAnalysis: '文本标注',
    textAnalysisNote: '新闻、文章中关键词的标注',
    creatBtn: '创建任务',
    taskImg: '预览模板',
    contact: '项目正在开发中，如有需要请联系我们',
    mail: '邮箱：fanhan@fanhantech.com',
    phone: '电话：0086512-6813-8573',
    js: {
      contact: '<p>项目正在开发中，如有需要请联系我们</p><p>邮箱：fanhan@fanhantech.com</p><p>电话：0086512-6813-8573</p>',
      developing: '任务--正在开发中',
      template: '模板',
      please: '请输入任务名称',
      creating: '您正在创建任务--',
      true: '确定',
      cancel: '取消',
      validator: '只能填写汉字、数字、字母及下划线',
      successNote: '新建任务成功',
      cancelNote: '取消输入'
    }
  },
  pushWav: {
    baseinfo: {
      dataSource: '数据源',
      language: '语言语种',
      languageNote: '请选择语言语种',
      english: '英文',
      chinese: '中文',
      others: '其他',
      othersLang: '填写其他语言，如法语',
      standard: '普通话',
      yes: '是',
      no: '否',
      othersStandard: '填写非普通话，如东北话',
      content: '内容类型',
      history: '历史',
      education: '教育',
      technology: '科技',
      otherContent: '请填写其他内容类型',
      scene: '场景类别',
      sceneType1: '标准无杂声',
      sceneType2: '电话',
      sceneType3: '对讲机',
      oherScene: '请填写其他场景类别',
      frequency: '音频采样率',
      frequencyNote: '请选择音频的采样率',
      depth: '采样深度',
      depthNote: '请选择音频的采样深度',
      wavRadio: '音频通道',
      wavRadio1: '单',
      wavRadio2: '双',
      format: '文件格式',
      formatOther: '请填写其他文件格式',
      remarks: '备注',
      skillTitle: '采集员或标注员所需技能',
      skill: '所需技能',
      qualifiedTitle: '数据合格标准',
      qualified: '合格标准',
      criterionTitle: '有效性判断准则',
      criterion: '判断准则',
      js: {
        rules: {
          language: '请选择语言语种',
          languageOther: '请填写其他语言语种',
          standard: '请选择是否为普通话',
          contentTypeOther: '请填写其他内容类型',
          format: '请至少选择一个文件格式',
          formatOther: '请填写文件格式',
          qualified: '请填写合格标准',
          skill: '请填写所需技能',
          criterion: '请填写有效性判断准则'
        }
      }
    },
    business: {
      template: '模板设定',
      labelDesign: '标签设计',
      radio: '单选题',
      checkbox: '多选题',
      show1: '语音标注模板（快速预览）',
      show2: '语音转写模板（快速预览）',
      show3: '语音切割模板（快速预览）',
      labelTag: '标注标签',
      cut: '是否切割',
      cut1: '是',
      cut2: '否',
      invalid: '无效音说明',
      special: '特殊转写说明',
      introduce: '任务介绍',
      brief: '任务简介',
      taskDate: '任务时间',
      date: '起止时间',
      startDate: '开始日期',
      to: '至',
      endDate: '结束日期',
      js: {
        rules: {
          brief1: '请填写任务简介',
          brief2: '长度128个字符以内',
          introduce1: '请填写任务介绍',
          introduce2: '长度1024个字符以内',
          date1: '请选择起止时间'
        },
        title: '题目',
        label: '选项',
        labelContent: '选项含义',
        text: '填空题'
      }
    },
    qcprice: {
      scale: '数据规模',
      voiceNum: '音频数量',
      num: '条',
      hour: '小时(总时间)',
      voiceQuality: '音频质量',
      voiceQuaNote: '请选择音频质量',
      taskTime: '任务预估时间',
      minute: '分钟（每条音频标注预估耗时）',
      checkType: '质检方式',
      checkType2: '质检方式',
      checkTypeNote: '请选择质检方式',
      checkProportion1: '审核价格比例',
      checkProportion2: '%（审核任务的报酬占做任务的的报酬比例）',
      spotCheck1: '抽检比例',
      spotCheck2: '%',
      spotCheck3: '抽查数量【',
      spotCheck4: '小时】审核任务单价【',
      spotCheck5: '积分/小时】',
      allCheckNum1: '检查次数',
      allCheckNum2: '次',
      allCheckNum3: '检查数量【',
      allCheckNum4: '小时】审核任务单价【',
      allCheckNum5: '积分/小时】',
      rightAnswer1: '累计答案',
      rightAnswer2: '个/条',
      tagNumber1: '标注人数',
      tagNumber2: '人/条（每条数据最多多少人做）',
      tagNumber3: '至少标注【',
      tagNumber4: '小时】',
      tagNumber5: '最多标注【',
      goldTest1: '比例',
      goldTest2: '预计标注【',
      price1: '报价',
      price2: '建议价格【',
      price3: '最低价格【',
      offer1: '标注单价',
      offer2: '积分/小时',
      sum1: '审核任务总价【',
      sum2: '积分】',
      sum3: '总价【',
      js: {
        rules: {
          num1: '条数不能为空',
          num2: '条数必须为数字值',
          hour1: '总时长不能为空',
          hour2: '总时长必须为数字值',
          scale1: '数据大小不能为空',
          scale2: '数据大小必须为数字值',
          voiceQuality: '请选择音频质量',
          taskTime1: '任务预估时间不能为空',
          taskTime2: '任务预估时间必须为数字值',
          checkType: '请选择质检方式',
          checkProportion1: '不能为空',
          checkProportion2: '必须为数字值',
          spotCheck1: '抽检比例不能为空',
          spotCheck2: '抽检比例必须为数字值',
          allCheckNum1: '全检次数不能为空',
          allCheckNum2: '全检次数必须为数字值',
          rightAnswer1: '不能为空',
          rightAnswer2: '必须为数字值',
          tagNumber1: '标注人数不能为空',
          tagNumber2: '标注人数必须为数字值',
          goldTest1: '不能为空',
          goldTest2: '必须为数字值',
          offer1: '客户单价不能为空',
          offer2: '客户单价必须为数字值'
        }
      }
    },
    sample: {
      name: '名称',
      describe: '描述',
      selectExample: '样例数据',
      selectExampleNote: '请选择样例数据',
      fileName: '文件名',
      fileSize: '大小',
      scope: '操作',
      choiceVoice: '上传新文件',
      uploadVoice: '点击上传文件',
      uploadVoiceNote: '只能上传音频文件，且不超过20Mb',
      trueExample: '正确样例列表',
      falseExample: '错误样例列表',
      addExample: '添加样例',
      true: '确定',
      cancel: '取消',
      delete: '删除',
      exampledata: '样例数据',
      selectexamdata: '请选择样例数据',
      uploadnewfile: '上传新文件',
      confirm: '确定',
      reset: '取消',
      filename: '文件名',
      filesize: '大小',
      operate: '操作',
      remove: '移除',
      lessupload: ' 只能上传音频文件，且不超过20Mb',
      clickupload: '点击上传文件',
      save: '保存',
      trueexample: '正确样例列表',
      addexample: '添加样例',
      errorexample: '错误样例列表',
      js: {
        rules: {
          name1: '请输入名称',
          name2: '长度在 1 到 10 个字符',
          selectExample: '请选择样例数据'
        },
        addStatus: {
          type1: '修改答案',
          type2: '添加答案'
        },
        success: {
          type1: '成功',
          type2: '确定',
          type3: '删除成功',
          type4: '上传成功',
          type5: '添加成功'
        },
        error: {
          type1: '失败',
          type2: '警告',
          type3: '取消',
          type4: '图片上传出错，请刷新重试！',
          type5: '每个用户最多上传10个文件',
          type6: '文件太大'
        },
        deleteSampleFile: '移除文件后，对应的样例也会被删除,是否继续',
        deleteSampleItem: '样例正被删除,是否继续?'
      }
    },
    tutorial: {
      tutorial: '教程',
      finish: '完成'
    }
  },
  password: {
    title: '重新设置密码',
    username: '请输入用户名',
    mobile: '请输入手机号',
    code: '请输入手机验证码',
    password: '请设置新密码',
    confirm: '请确认新密码',
    form: '设置新密码',
    js: {
      error: '失败',
      success: '成功',
      sendAgain: '重新发送',
      send: '发送验证码'
    }
  },
  project: {
    price: '价格',
    typeStr: '类型',
    duration: '周期',
    day: '天',
    examine: '审核',
    mytask: '我的任务',
    makemoney: '开始赚钱',
    description: '项目描述',
    requirement: '项目要求',
    projectNo: '你好像暂时不能申请该任务。',
    return: '返回项目列表'
  },
  projects: {
    projecttype: '项目类型：',
    all: '全部',
    text: '文本',
    voice: '语音',
    picture: '图片',
    video: '视频',
    typeStr: '类型：',
    duration: '周期：',
    day: '天',
    pubdate: '1个月前发布',
    label: '233人标注中'
  },
  pushimage: {
    course: '教程',
    baseinfo: {
      datasource: '数据源',
      fileformat: '文件格式',
      other: '其他',
      otherformat: '请填写其他文件格式',
      maxwidth: '最大图片宽度',
      maxheight: '最大图片高度',
      minwidth: '最小图片宽度',
      minheight: '最小图片高度',
      note: '备注',
      skill: '采集员或标注员所需技能',
      ski: '所需技能',
      dataqualified: '数据合格标准',
      qualified: '合格标准',
      valcriterion: '有效性判断准则',
      criterion: '判断准则',
      js: {
        rules: {
          maxWidth: '请填写图片最大宽度',
          maxHeight: '请填写图片最大高度',
          minWidth: '请填写图片最小宽度',
          minHeight: '请填图片最小高度',
          format: '请至少选择一个文件格式',
          formatOther: '请填写文件格式',
          qualified: '请填写合格标准',
          skill: '请填写所需技能',
          criterion: '请填写有效性判断准则'
        }
      }
    },
    business: {
      wholemap: '整图问题',
      singlechoice: '单选题',
      multiplechoice: '多选题',
      fillblank: '填空题',
      labelproblem: '标注项问题',
      entercontent: '请输入内容',
      preview: '预览模板',
      rectChoice: '框选设置（单位：像素）',
      rectMinW: '最小长度',
      rectMinH: '最小宽度',
      rectMinArea: '最小面积',
      rectNote1: '您可以对框选的尺寸进行设置，标注员标注的矩形尺寸不能小于您设置的参数',
      rectNote2: '默认尺寸：最小长度为5px，最小宽度为5px，最小面积为20px',
      taskintro: '任务介绍',
      taskbref: '任务简介',
      tasktime: '任务时间',
      starttime: '起止时间',
      to: '至',
      startdate: '开始日期',
      stopdate: '结束日期',
      unsatisfy: '模板不满意？',
      service: '我要定制专属服务！',
      js: {
        rules: {
          brief1: '请填写任务简介',
          brief2: '长度128个字符以内',
          introduce1: '请填写任务介绍',
          introduce2: '长度10000个字符以内',
          date1: '请选择起止时间'
        },
        title: '题目',
        label: '选项',
        labelContent: '选项含义',
        text: '填空题'
      }
    },
    qcprice: {
      datascale: '数据规模',
      picturenum: '图片数量',
      zhang: '张',
      picturequality: '图片质量',
      selectpicquality: '请选择图片质量',
      estimate: '任务预估时间',
      minute: '分钟（每张图片标注预估耗时）',
      qualitytest: '质检方式',
      qualitytest2: '质检方式',
      selectquatest: '请选择质检方式',
      priceratio: '审核价格比例',
      scale: '（审核任务的报酬占做任务的的报酬比例）',
      checkrate: '抽检比例',
      spotnumber: '抽查数量',
      taskprice: '审核任务单价',
      integral: '积分/张',
      total: '累计答案',
      checktimes: '检查次数',
      time: '次',
      checknumber: '检查数量',
      perzhang: '个/张',
      moreamount: '人/张（每张数据最多多少人做）',
      labelnum: '标注人数',
      leastlabel: '至少标注',
      morelabel: '最多标注',
      rate: '比例',
      expectlabel: '预计标注',
      quote: '报价',
      suggestprice: '建议价格',
      leastprice: '最低价格',
      unitprice: '标注单价',
      totalprice: '审核任务总价',
      sumprice: '总价',
      inter: '积分',
      leftpart: '【',
      rightpart: '】',
      js: {
        rules: {
          num1: '数量不能为空',
          num2: '数量必须为数字值',
          scale1: '数据大小不能为空',
          scale2: '数据大小必须为数字值',
          thisQuality: '请选择图片质量',
          taskTime1: '任务预估时间不能为空',
          taskTime2: '任务预估时间必须为数字值',
          checkType: '请选择质检方式',
          checkProportion1: '不能为空',
          checkProportion2: '必须为数字值',
          spotCheck1: '抽检比例不能为空',
          spotCheck2: '抽检比例必须为数字值',
          allCheckNum1: '全检次数不能为空',
          allCheckNum2: '全检次数必须为数字值',
          rightAnswer1: '不能为空',
          rightAnswer2: '必须为数字值',
          tagNumber1: '标注人数不能为空',
          tagNumber2: '标注人数必须为数字值',
          goldTest1: '不能为空',
          goldTest2: '必须为数字值',
          offer1: '客户单价不能为空',
          offer2: '客户单价必须为数字值'
        }
      }
    },
    sample: {
      name: '名称',
      describe: '描述',
      exampledata: '样例数据',
      selectexamdata: '请选择样例数据',
      uploadnewfile: '上传新文件',
      confirm: '确定',
      reset: '取消',
      filename: '文件名',
      filesize: '大小',
      operate: '操作',
      remove: '移除',
      lessupload: ' 只能上传音频文件，且不超过20Mb',
      clickupload: '点击上传文件',
      save: '保存',
      trueexample: '正确样例列表',
      addexample: '添加样例',
      delete: '删除',
      errorexample: '错误样例列表',
      js: {
        rules: {
          name1: '请输入名称',
          name2: '长度在 1 到 10 个字符',
          selectExample: '请选择样例数据'
        },
        addStatus: {
          type1: '修改答案',
          type2: '添加答案'
        },
        success: {
          type1: '成功',
          type2: '确定',
          type3: '删除成功',
          type4: '上传成功',
          type5: '添加成功'
        },
        error: {
          type1: '失败',
          type2: '警告',
          type3: '取消',
          type4: '图片上传出错，请刷新重试！',
          type5: '每个用户最多上传10个文件',
          type6: '文件太大'
        },
        deleteSampleFile: '移除文件后，对应的样例也会被删除,是否继续',
        deleteSampleItem: '样例正被删除,是否继续?'
      }
    }
  },
  pushtext: {
    // createtask: '创建任务',
    // businessinfo: '业务信息',
    // detailinfo: '详细信息',
    // offer: '设置报价',
    // fillexample: '填写样例',
    // course: '教程',
    // goback: '上一步',
    // save: '保存',
    // next: '下一步',
    baseinfo: {
      datasource: '数据源',
      fileformat: '文件格式',
      other: '其他',
      otherformat: '请填写其他文件格式',
      note: '备注',
      skill: '采集员或标注员所需技能',
      ski: '所需技能',
      dataqualified: '数据合格标准',
      qualified: '合格标准',
      valcriterion: '有效性判断准则',
      criterion: '判断准则',
      js: {
        rules: {
          format: '请至少选择一个文件格式',
          formatOther: '请填写文件格式',
          qualified: '请填写合格标准',
          skill: '请填写所需技能',
          criterion: '请填写有效性判断准则'
        }
      }
    },
    business: {
      wholemap: '全局题目设置',
      singlechoice: '单选题',
      multiplechoice: '多选题',
      fillblank: '填空题',
      labelproblem: '标注项问题',
      entercontent: '请输入内容',
      preview: '预览模板',
      taskintro: '任务介绍',
      taskbref: '任务简介',
      tasktime: '任务时间',
      starttime: '起止时间',
      to: '至',
      startdate: '开始日期',
      stopdate: '结束日期',
      unsatisfy: '模板不满意？',
      service: '我要定制专属服务！',
      js: {
        rules: {
          brief1: '请填写任务简介',
          brief2: '长度128个字符以内',
          introduce1: '请填写任务介绍',
          introduce2: '长度1024个字符以内',
          date1: '请选择起止时间'
        },
        title: '题目',
        label: '选项',
        labelContent: '选项含义',
        text: '填空题'
      }
    },
    qcprice: {
      datascale: '数据规模',
      picturenum: '文本数量',
      zhang: '个',
      picturequality: '文本质量',
      selectpicquality: '请选择文本质量',
      estimate: '任务预估时间',
      minute: '分钟（每个任务标注预估耗时）',
      qualitytest: '质检方式',
      selectquatest: '请选择质检方式',
      priceratio: '审核价格比例',
      scale: '（审核任务的报酬占做任务的的报酬比例）',
      checkrate: '抽检比例',
      spotnumber: '抽查数量',
      taskprice: '审核任务单价',
      integral: '积分/个',
      total: '累计答案',
      checktimes: '检查次数',
      time: '次',
      checknumber: '检查数量',
      perzhang: '个/个',
      moreamount: '人/个（每个数据最多多少人做）',
      labelnum: '标注人数',
      leastlabel: '至少标注',
      morelabel: '最多标注',
      rate: '比例',
      expectlabel: '预计标注',
      quote: '报价',
      suggestprice: '建议价格',
      leastprice: '最低价格',
      unitprice: '标注单价',
      totalprice: '审核任务总价',
      sumprice: '总价',
      inter: '积分',
      leftpart: '【',
      rightpart: '】',
      js: {
        rules: {
          num1: '数量不能为空',
          num2: '数量必须为数字值',
          scale1: '数据大小不能为空',
          scale2: '数据大小必须为数字值',
          thisQuality: '请选择文本质量',
          taskTime1: '任务预估时间不能为空',
          taskTime2: '任务预估时间必须为数字值',
          checkType: '请选择质检方式',
          checkProportion1: '不能为空',
          checkProportion2: '必须为数字值',
          spotCheck1: '抽检比例不能为空',
          spotCheck2: '抽检比例必须为数字值',
          allCheckNum1: '全检次数不能为空',
          allCheckNum2: '全检次数必须为数字值',
          rightAnswer1: '不能为空',
          rightAnswer2: '必须为数字值',
          tagNumber1: '标注人数不能为空',
          tagNumber2: '标注人数必须为数字值',
          goldTest1: '不能为空',
          goldTest2: '必须为数字值',
          offer1: '客户单价不能为空',
          offer2: '客户单价必须为数字值'
        }
      }
    },
    sample: {
      name: '名称',
      describe: '描述',
      exampledata: '样例数据',
      selectexamdata: '请选择样例数据',
      uploadnewfile: '上传新文件',
      confirm: '确定',
      reset: '取消',
      filename: '文件名',
      filesize: '大小',
      operate: '操作',
      remove: '移除',
      lessupload: ' 只能上传音频文件，且不超过20Mb',
      clickupload: '点击上传文件',
      save: '保存',
      trueexample: '正确样例列表',
      addexample: '添加样例',
      delete: '删除',
      errorexample: '错误样例列表',
      js: {
        rules: {
          name1: '请输入名称',
          name2: '长度在 1 到 10 个字符',
          selectExample: '请选择样例数据'
        },
        addStatus: {
          type1: '修改答案',
          type2: '添加答案'
        },
        success: {
          type1: '成功',
          type2: '确定',
          type3: '删除成功',
          type4: '上传成功',
          type5: '添加成功'
        },
        error: {
          type1: '失败',
          type2: '警告',
          type3: '取消',
          type4: '图片上传出错，请刷新重试！',
          type5: '每个用户最多上传10个文件',
          type6: '文件太大'
        },
        deleteSampleFile: '移除文件后，对应的样例也会被删除,是否继续',
        deleteSampleItem: '样例正被删除,是否继续?'
      }
    }
  },
  workbench: {
    navTitle1: '项目',
    navTitle2: '账户',
    subNavTit1: '参与的项目',
    subNavTit2: '发布的项目',
    subNavTit3: '积分总览',
    subNavTit4: '兑换记录',
    js: {
      error: '失败',
      success: '成功'
    },
    account: {
      overfiew: '积分总览',
      integral: '可用积分',
      exchange: '兑换提现'
    },
    join: {
      takepart: '参与的项目',
      name: '名称',
      typeStr: '类型',
      statusStr: '状态',
      operate: '操作',
      see: '查看'
    },
    publish: {
      taskmanage: '任务管理',
      createtask: '创建任务',
      release: '发布中',
      taskandname: '任务编号&名称',
      number: '编号:',
      name: '名称:',
      starttime: '预发布日期',
      taskstate: '任务状态',
      operate: '操作',
      alterinfo: '修改信息',
      businessinfo: '业务信息',
      detailinfo: '详细信息',
      offer: '报价',
      example: '样例',
      course: '教程',
      audit: '提交审核',
      publish: '发布',
      delete: '删除',
      puslished: '已发布',
      releasetime: '发布日期',
      total: '总量',
      finished: '完成量',
      unfinished: '未完成量',
      js: {
        error: {
          type1: '警告',
          type2: '取消'
        },
        success: {
          type1: '确定',
          type2: '提交成功',
          type3: '发布成功'
        },
        reviewing: '正在审核',
        pushReview: '任务提交审核后，将无法再修改信息,是否继续?',
        delTask: '是否确定删除任务，删除后无法撤销,是否继续?'
      }
    },
    records: {
      transrecord: '交易记录',
      money: '金额',
      time: '时间'
    },
    withdraw: {
      exchangecase: '兑换提现',
      availintegral: '可用积分：',
      money: '元',
      note: '注：100积分=1.00元',
      putforward: '提现到：',
      alipay: '支付宝',
      alipayaccount: '支付宝账户：',
      pleaseinput: '请输入',
      alipayname: '支付宝姓名：',
      overall: '总计需要：',
      inter: '积分',
      redeemnow: '立即兑换',
      integral: '可用积分：',
      confirminfo: '请确认提现信息',
      amountcash: '提现金额：',
      comealipay: '提现到：支付宝',
      reset: '取消',
      confirm: '确认',
      cellphone: '手机验证',
      inputphone: '请输入手机号',
      inputcode: '请输入手机验证码',
      incomes: '个人所得税',
      incomesTit1: '根据国家规定的兼职个人所得税政策，对于兼职收入中每月超过800元的部分，',
      incomesTit2: '国家将收取其中20%的个人所得税，该部分税务会从提现金额中自动扣除，由我司代交。',
      js: {
        rules: {
          account: '请输入支付宝账户',
          name1: '请输入支付宝姓名',
          name2: '你输入的姓名与身份证姓名不匹配'
        },
        sendAgain: '重新发送',
        send: '发送验证码',
        points: '你可用积分不足'
      }
    },
    limitMgr: {
      limitMgr: '权限管理',
      usernameNote: '输入用户名或用户名前缀（不支持空格，换行）',
      limit: '权限',
      please: '请选择权限',
      nolimit: '无权限',
      taskdo: '做任务',
      check: '审核',
      update: '更新',
      return: '返回',
      reports: '报表',
      js: {
        rule: {
          username: '请输入用户名或用户名前缀（不支持空格，换行）',
          tuflag: '请选择权限'
        },
        success: '修改成功'
      }
    }
  },
  user: {
    nav: {
      title1: '基础信息',
      profile: '个人信息',
      title2: '技能信息',
      skill: '技能展示',
      title3: '账户&安全',
      real: '实名认证'
    },
    profile_form: {
      editinfo: '编辑个人信息',
      tips: '提示：您需要完善标有星号 (*) 的信息才能参与项目',
      username: '用户名：',
      sex: '性别：',
      male: '男',
      female: '女',
      birthday: '出生日期：',
      selectday: '选择日期',
      location: '所在地：',
      uploadavatar: '点击上传头像',
      nationality: '国籍：',
      pleaseselect: '请选择',
      ethnicity: '种族：',
      whiteperson: '白种人',
      yellowperson: '黄种人',
      blackperson: '黑种人',
      marriage: '婚姻状态：',
      unmarry: '未婚',
      married: '已婚',
      monthertonue: '母语：',
      chinese: '汉语',
      english: '英语',
      education: '学历：',
      juniorschool: '初中',
      highschool: '高中',
      juniorcollege: '大专',
      regularcollege: '本科',
      graduatestudent: '研究生',
      doctor: '博士',
      industry: '行业：',
      internet: '互联网',
      finance: '金融',
      edu: '教育',
      service: '服务',
      income: '收入：',
      lessthan: '1000以下',
      morethan: '5000以上',
      save: '保存',
      reset: '取消',
      js: {
        rules: {
          gender: '请选择性别',
          birthday: '请选择日期',
          fields: '请选择所在地'
        },
        error: {
          type1: '失败',
          type2: '上传头像图片只能是 JPG 格式!',
          type3: '上传头像图片大小不能超过 2MB!'
        },
        success: '成功'
      }
    },
    profile: {
      info: '个人信息',
      edit: '编辑',
      js: {
        man: '男',
        woman: '女',
        marital1: '未婚',
        marital2: '已婚'
      }
    },
    real_from: {
      realname: '实名认证',
      truename: '真实姓名',
      idcrdnum: '身份证号',
      idcardfront: '身份证头像、姓名面照片',
      idcardback: '身份证有效期信息面照片',
      idcardhold: '手持身份证头像、姓名面照片',
      idcard: '身份证',
      passport: '护照',
      passportNum: '护照号码',
      passportImg: '护照首页照片',
      submit: '提交审核',
      js: {
        rules: {
          realName: '请输入正确的姓名',
          idCardNum1: '请输入正确身份证号',
          idCardNum2: '最小长度15，最大长度18',
          idCardFront: '请上传身份证头像、姓名面照片',
          idCardBack: '请上传身份证有效期信息面照片',
          idCardHold: '请上传手持身份证头像、姓名面照片',
          passportNum: '请填写护照号',
          passportFront: '请上传护照照片'
        },
        error: {
          type1: '失败',
          type2: '上传头像图片只能是 JPG 格式!',
          type3: '上传头像图片大小不能超过 2MB!'
        },
        success: '成功'
      }
    },
    real: {
      realname: '实名认证',
      reform: '重新认证',
      truename: '真实姓名：',
      idcardnum: '身份证号：',
      passportNum: '护照号码：',
      status: '认证审核状态：',
      js: {
        realStatus1: '审核中',
        realStatus2: '审核通过',
        realStatus3: '审核未通过'
      }
    },
    skill: {
      editskill: '编辑技能信息',
      language: '擅长的语言：',
      select: '请选择',
      save: '保存',
      reset: '取消',
      skillshow: '技能展示',
      edit: '编辑',
      js: {
        success: '成功',
        error: '失败',
        chinese: '汉语',
        english: '英语',
        spanish: '西班牙语'
      }
    }
  },
  voiceExample: {
    finish: '今日完成',
    title: '请按要求标注下面一段语音。',
    pause: '暂停',
    play: '播放',
    stop: '停止',
    zoomin: '放大',
    zoomout: '缩小',
    add: '增加',
    loading: '拼命加载中',
    current: '当前',
    editor: '备注',
    save: '保存',
    js: {
      valid: '有效',
      noValid: '无效',
      errVoice: '音频加载失败，请确认音频是否有效',
      error: '失败',
      errMessage: '您的浏览器可能不支持暂时保存',
      success: '成功',
      sucMessage: '保存成功'
    }
  },
  task1005: {
    message: '请检查所有标注是否都已完成'
  },
  taskPublic: {
    finish: '今日完成',
    loading: '拼命加载中',
    submitTask: '提交',
    play: '播放',
    stop: '停止',
    pause: '暂停',
    zoomout: '缩小',
    zoomin: '放大',
    cut: '分段',
    add: '增加',
    regionPlay: '播放选中',
    regionDelete: '删除选中',
    valid: '有效',
    noValid: '无效',
    editor: '备注',
    rejectTask: '拒绝',
    acceptTask: '通过',
    reviseAndAccept: '提交并通过',
    reviseTask: '修改并提交',
    success: '成功',
    warning: '警告',
    error: '失败'
  },
  task3Do: {
    title: '请按要求标注下面一段语音。',
    invalidTask: '无效音频',
    role: '角色',
    STA: '背景持续噪音',
    NON: '突发的非语音类噪音',
    FIL: '无实际意义的语气词(本人)',
    RSP: '无实际意义的语气词(非本人)',
    SPK: '语音噪音',
    NPS: '非发音人发出的语音噪音',
    region: '选中区域：',
    please: '请输入内容',
    appNotify1: '请完成所有标注',
    appNotify2: '，至少有一段',
    appNotify3: '，保证起始位置在0.000',
    appNotify4: '，保证末尾位置在最后',
    add: '和',
    appNotify5: '首尾不相接',
    appNotify6: '段内容不完整',
    waveNotify1: '已经最大了',
    waveNotify2: '已经最小了',
    current: '当前',
    deafness: '听不清'
  },
  labelTool: {
    preview: '预览',
    move: '移动图片',
    rect: '矩形',
    point: '描点',
    ploygon: '多边形',
    polyline: '折线',
    bezier: '曲线区域',
    bezierline: '曲线',
    magicmode: '魔法',
    unmagic: '反魔法',
    complete: '完成',
    delete: '删除',
    recall: '撤销',
    clear: '清空标注',
    reset: '重置图片',
    filstyNor: '标注颜色',
    filstySP: '选中颜色-线',
    filstySPs: '选中颜色-点',
    pointradius: '标注点大小',
    linewidth: '标注线宽',
    please: '请输入内容',
    workbanch: '工作台',
    radio: '单选题',
    checkbox: '多选题',
    input: '填空题',
    noChoice: '未选择',
    noNull: '为空',
    lengthErr: '长度错误',
    errorMessage: '请检查所有标注是否都已完成'
  }
}
