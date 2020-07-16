/*
  compiler功能：
  1.负责编译模版，解析指令/差值表达式
  2.负责页面的首次渲染
  3.当数据变化后重新渲染视图
*/

class Compiler{
    constructor(vm){
        this.el = vm.$el
        this.vm = vm
        // 立即开始编译模版
        this.compile(this.el)
    }
    // 编译模版，处理文本节点和元素节点
    compile(el){
        let childNodes = el.childNodes

        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if(this.isTextNode(node)){
                this.compileText(node)
            }else if(this.isElementNode(node)){
                // 处理元素节点
                this.compileElement(node)
            }

            // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
            if(node.childNodes && node.childNodes.length){
                this.compile(node)
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node){
        // console.log(node.attributes)

        // 遍历所有的属性节点
        Array.from(node.attributes).forEach(attr => {
            //判断是否是指令
            let attrName = attr.name // v-text/v-model
            if(this.isDirective(attrName)){
                // v-text 转化成 text
                attrName = attrName.substr(2)
                let key = attr.value // msg count
                this.update(node, key, attrName)
            }
        })
    }
    update(node,key,attrName){
        let updateFn = this[attrName+'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }
    // 处理v-text指令
    textUpdater(node,value,key){
        node.textContent = value

        // 创建 watcher 对象，当数据改变，更新视图(响应式)
        new Watcher(this.vm,key,(newValue)=>{
            node.textContent = newValue
        })
    }
    // 处理v-model指令
    modelUpdater(node,value,key){
        node.value = value

        // 创建 watcher 对象，当数据改变，更新视图(响应式)
        new Watcher(this.vm,key,(newValue)=>{
            node.value = newValue
        })

        // 双向绑定
        node.addEventListener('input',() => {
            this.vm[key] = node.value
        })
    }
    // 编译文本节点，处理差值表达式
    compileText(node){
        // console.dir(node)
        
        // 差值表达式：{{ msg }}
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)){
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg,this.vm[key]) // 将值更新到页面上

            // 创建 watcher 对象，当数据改变，更新视图(响应式)
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }
    // 判断元素属性是否是指令
    isDirective(attrName){
        return attrName.startsWith('v-')
    }
    // 判断节点是否是文本节点
    isTextNode(node){
        return node.nodeType === 3
    }
    // 判断是否是元素节点
    isElementNode(node){
        return node.nodeType === 1
    }
}
