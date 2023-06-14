import cloneObj from "./cloneObj"

export function calcTemplateValues(template) {
  let acc = 0

  template.map(row => row.map(value => acc += value))
  
  return acc
}

// ![normalised index]
export function getCellPositionByIndex(template, index) {
  if (typeof index !== 'number') {
    return null
  }

  index--
  return [Math.floor(index / template.length), index % template[0].length]
}
// ![normalised index]
export function getCellByIndex(template, index) {
  if (typeof index !== 'number') {
    return null
  }

  const position = getCellPositionByIndex(template, index) 
  return template[position[0]][position[1]]
}
// ![normalised index]
export function setCellByIndex(template, index, value) {
  if (typeof index !== 'number') {
    return null
  }

  const clone = cloneObj(template)

  const position = getCellPositionByIndex(clone, index) 
  clone[position[0]][position[1]] = value
  return clone
}

// ![normalised index]
export function getBaseIndex(rules, letter) {
  const result = Object.entries(rules).find(entry => 'base' in entry[1] && entry[1].base === letter)
  return result ? Number(result[0]) : null
}

// ![normalised index]
export function getStrongholdIndexes(rules, letter) {
  const result = Object.entries(rules).filter(entry => 'stronghold' in entry[1] && entry[1].stronghold === letter)
  return result.map(entry => Number(entry[0]))
}

// ![normalised index]
export function addRule(rules, index, value) {
  const clone = cloneObj(rules)
  
  clone[String(index)] = value

  return clone
}
// ![normalised index]
export function removeRule(rules, index) {
  if (typeof index !== 'number') {
    return rules
  }
  return Object.fromEntries(Object.entries(rules).filter(entry => entry[0] !== String(index)))
}

export function pretifyCellValue(value) {
  if (value === null || value === undefined) {
    return '-'
  }

  return value
}