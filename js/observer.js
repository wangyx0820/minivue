/*
    Observer功能：
    1.负责把 data 选项中的属性转化成响应式数据，转化成getter和setter
    2.data 中的某个属性也是对象，把该属性转化成响应式数据
    3.数据变化发送通知
*/
class Observer {
    constructor(data){
        this.walk(data)
    }
    walk(data){
        // 1.判断data是否是对象
        if(!data || typeof data != 'object'){
            return
        }
        // 2.遍历data中的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    // 定义响应式数据
    defineReactive(obj,key,val){
        let that = this

        // 负责收集依赖并发送通知
        let dep = new Dep()

        // 如果val是对象，把val内部的属性转化成响应式数据（比如person下的name属性）
        this.walk(val)

        Object.defineProperty(obj,key,{
            enumberable:true,
            configurable:true,
            get () {
                // 收集依赖:谁依赖了这个数据，就把谁放入依赖数组中
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set (newValue) {
                if(newValue === val){
                    return
                }
                val = newValue
                // 如果修改数据，将修改后的数据也转化成响应式数据
                that.walk(newValue)
                // 发送通知,通知所有
                dep.notify()
            }
        })
    }
}
