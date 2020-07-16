/*
    Dep:Dependency
    1.收集依赖，添加观察者（watcher）
    2.通知所有观察者
*/
class Dep{
    constructor(){
        //存储所有的观察者
        this.subs = []
    }
    // 添加观察者 watcher
    addSub(sub){
        if(sub && sub.update){
            this.subs.push(sub)
        }
    }
    // 发送通知
    notify(){
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
