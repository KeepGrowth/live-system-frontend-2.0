function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      // 这里定义什么算作“空”：null, undefined, 或 空字符串
      return value !== null && value !== undefined && value !== ''
    })
  )
}


// 全局配置
const settings = {
  // 目标状态选项
  goalStatusOptions: [],
  // todo重要性选项
  todoImportanceOptions: [
    {}
  ]
}

export default { cleanObject, settings }
