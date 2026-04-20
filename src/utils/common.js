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

/**
 * 将 Hex 颜色转换为 RGBA 字符串
 * @param {string} hex - 颜色代码，如 '#00f3ff'
 * @param {number} opacity - 透明度 0-1
 */
function hexToRgba(hex, opacity) {
  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
}

export default { cleanObject, settings,hexToRgba }
