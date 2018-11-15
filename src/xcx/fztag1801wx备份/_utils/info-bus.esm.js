const infoBus = {
    events: {},
    $emit(name, ...rest) {// 触发事件
        const taskArray = this.events[name];
        if (taskArray instanceof Array) {
            for (let task of taskArray) {
                task.callback.apply(this, rest);
                if(task.type==='once'){
                    const index = taskArray.indexOf(task);
                    taskArray.splice(index, 1);
                }
            }
        }
    },
    $on(name, callback) {// 注册事件
        const taskArray = this.events[name];
        if (taskArray === undefined) {
            this.events[name] = [];
            this.events[name].push({type:'on',callback});
        } else {
            taskArray.push({type:'on',callback});
        }
    },
    $off(name, callback) {// 注销事件
        if (callback === undefined) {
            this.events[name] = [];
            return;
        }
        const taskArray = this.events[name];
        if (taskArray instanceof Array) {
            taskArray.map((task, index, array)=>{
                if (task.callback === callback) {
                    array.splice(index, 1);
                }
            });
        }
    },
    $once(name, callback) {// 监听一次
        const taskArray = this.events[name];
        if (taskArray === undefined) {
            this.events[name] = [];
            this.events[name].push({type:'once',callback});
        } else {
            taskArray.push({type:'once',callback});
        }
    },
};
export default infoBus;
