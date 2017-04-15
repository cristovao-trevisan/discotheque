const path = require('path')

// TODO: Documentation
export const formatTime = (time) => parseInt(time/60)+':'+zeroPad(time%60, 2)

// TODO: Documentation
export const zeroPad = (num, places) => {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
// TODO: Documentation
export const convertToItems = function(objects, conversion){
  var items = []
  for(let id in objects){
    var object = objects[id]
    var item = {}
    for(let key in conversion){
      item[conversion[key]] = objects[id][key]
    }
    items.push(item)
  }
  return items
}

// TODO: Documentation
export const convertToArray = function(object){
  var items = []
  for(let id in object){
    items.push(object[id])
  }
  return items
}

// TODO: Documentation
export const filterObject = function(object, filter){
  var result = {}
  for(let key in object){
    if(filter(object[key], key)) result[key] = object[key]
  }
  return result
}

export const compoundStyles = function(){
  var output = {}
  for(let i in arguments){
    if(typeof arguments[i] === 'object'){
      output = {...output, ...arguments[i]}
    }
  }
  return output
}
