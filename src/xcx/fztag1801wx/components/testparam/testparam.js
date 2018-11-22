Component({
  options: {
    addGlobalClass: true,
  },
  properties:{
    response:{
      type:Object,
      value:''
    },
    is_loadmore:{
      type:Boolean,
      value:false
    },
    tip:{
      type:String,
      value:'我是有底綫的'
    },
    paramFuToZi:String
  },
  data: {
    
  },
  methods: {
    change:function(){
      this.triggerEvent('myevent',{paramZiToFu:12344})
    },
    // emit:function(data){
    //   let val=data
    //   my_event_detail={val:val}
    //   this.triggerEvent('myevent',my_event_detail)
    // }
  }
})
