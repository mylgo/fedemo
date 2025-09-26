let data = { name: '小明', age: 20 }

// 保存原始值
const originalAge = data.age

Object.defineProperty(data, 'age', {
  get() {
    return this._age
  },
  set(newValue) {
    this._age = newValue
    console.log('年龄更新为:', newValue)
  },
})

// 设置初始值
data._age = originalAge

data.age = 25 // 控制器生效，输出: 年龄更新为: 25
