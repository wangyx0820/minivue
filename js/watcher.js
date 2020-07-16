/*
    watcher功能：
    1.当数据变化触发依赖，dep 通知所有的 watcher 实例更新视图
    2.自身实例化的时候往 dep 对象中添加自己
*/

class Watcher{
    constructor(vm,key,cb){
        this.vm = vm
        // data 中的属性名称
        this.key = key
        // 回调函数负责更新视图
        this.cb = cb

        // 把 watcher 对象记录在 Dep 类的静态属性 target
        Dep.target = this
        // 触发get方法，在get方法中会调用addSub方法
        this.oldValue = vm[key]
        // 防止重复添加
        Dep.target = null
    }
    // 当数据发生变化时更新视图
    update(){
        let newValue = this.vm[this.key]
        if(this.oldValue === newValue){
            return
        }
        this.cb(newValue)
    }
}
