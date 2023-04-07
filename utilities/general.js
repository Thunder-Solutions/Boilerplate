/**
 * Apply classes dynamically based on boolean expressions
 * @param {Object.<string, boolean>} classMap - Each key is a class, and each value dictates whether to apply that class or not
 * @param  {...string} classes - Classes that should always be applied, without conditions
 * @returns {string} The full className
 */
export const getClassName = (classMap, ...classes) => {
  const classArr = [
    ...Object.entries(classMap).reduce((classes, [_class, applyClass]) => {
      if (applyClass) classes.push(_class)
      return classes
    }, []),
    ...classes,
  ]
  return classArr.join(' ')
}

/**
 * Includes null and all nonprimitive types
 * @param {unknown} val - The value whose type to get
 * @returns {string} The type of the provided value
 */
export const getType = val => {
  if (val === null) return 'null'
  if (typeof val === 'object') return val.constructor.name.toLowerCase()
  return typeof val
}

/**
 * A safe alternative to `typeof`, including null and all nonprimitive types
 * @param {unknown} val - The value whose type to check
 * @param {string|[string]} type - The type(s) to check against
 * @returns {boolean|TypeError} `true` if the value matches the provided type(s)
 */
export const checkType = (val, type) => {
  const validString = getType(type) === 'string'
  const validArray = getType(type) === 'array' && type.every(t => getType(t) === 'string')
  if (!validString && !validArray) return new TypeError('`checkType()` expects either a string or array of strings in the second argument')
  if (validString) return getType(val) === type
  if (validArray) return type.some(t => getType(val) === t)
}

/**
 * Converts any value to a boolean, but non-empty strings must read "true" or "false"
 * @param {unknown} val - The value to convert
 * @returns {boolean|TypeError} The converted value based on the input
 */
export const bool = val => {
  const isString = checkType(val, 'string')
  const _val = isString ? val.toLowerCase().trim() : val
  const strValues = ['', 'true', 'false']
  if (isString && !strValues.includes(_val)) {
    return new TypeError('Could not convert string to boolean because the string was not empty and neither "true" nor "false"')
  }
  return isString ? _val === 'true' : Boolean(_val)
}

/**
 * A simpler syntax for objects with typed properties
 * @template T
 * @typedef {{ [key: string]: T }} TypedObject
 */
/**
 * An object that consists only of deeply nested strings
 * @typedef {{ [key: string]: (string|DeepStringObject) }} DeepStringObject
 */

/**
 * Merges subproperties, as opposed to `{ ...obj1, ...obj2 }` which replaces subproperties entirely.
 * @param {TypedObject<unknown>} fallback - An object containing the default properties
 * @param {TypedObject<unknown>} override - An object containing the override properties
 * @returns {TypedObject<unknown>} The final merged object
 */
export const mergeDeep = (fallback, override) => Object.keys(fallback).reduce((outputObj, key) => {
  const isObj1 = checkType(fallback[key], 'object')
  const isObj2 = checkType(override[key], 'object')
  const isArr1 = checkType(fallback[key], 'array')
  const isArr2 = checkType(override[key], 'array')
  if (isObj1 && isObj2) {
    outputObj[key] = mergeDeep(fallback[key], override[key])
  } else if (isArr1 && isArr2) {

    // special treatment for arrays
    const isObjArr = arr => arr.every(i => checkType(i, 'object'))
    const objArr = isObjArr(fallback[key]) && isObjArr(override[key])
    if (objArr) {

      // merge all objects inside arrays
      outputObj[key] = fallback[key].map((obj, idx) => mergeDeep(obj, override[key][idx]))
    } else {

      // shallow merge arrays of primitives
      outputObj[key] = [...fallback[key], ...override[key]]
    }
  } else {
    outputObj[key] = override[key] ?? fallback[key]
  }
  return outputObj
}, { ...fallback, ...override })

/**
 * Parses a single string's variables provided the locale and variable mappings
 * @param {string} str - The string whose variables we wish to parse
 * @param {string} locale - The language/country designation for the variables
 * @param {TypedObject<string>} variables - The mappings of variables by locale
 * @returns {string} The final parsed string
 */
const parseVariablesInString = (str, locale, variables) => {
  const varKV = Object.entries(variables[locale])
  return varKV.reduce((outputStr, [key, value]) => {
    outputStr = outputStr.replace(key, value)
      .replace(/(?<!\\)({|})/g, '')
      .replace(/\\/g, '')
    return outputStr
  }, str)
}

/**
 * Parses all of the variables in the provided object's values
 * @param {DeepStringObject} localeData - The object with all the string values to parse
 * @param {string} locale - The language/country designation for the variables
 * @param {TypedObject<string>} variables - The mappings of variables by locale
 * @returns {DeepStringObject} The same structured data that was passed in, except with replaced variable values
 */
export const parseVariables = (localeData, locale, variables) => {
  const init = checkType(localeData, 'array') ? [] : {}
  return Object.entries(localeData).reduce((parsedLocaleData, [key, value]) => {
    if (checkType(value, 'string')) parsedLocaleData[key] = parseVariablesInString(value, locale, variables)
    else parsedLocaleData[key] = parseVariables(value, locale, variables)
    return parsedLocaleData
  }, init)
}

/**
 * This function quickly creates a URL object from any href string
 * @param {string} href - An absolute or relative URL path
 * @returns {URL} - A URL object created from the href passed in
 */
export const getURL = (href, { relativeTo = 'current', basePath: _basePathOverride } = {}) => {
  if (!href) return null
  const absRegex = /^([^/]+?)\/\//
  const isAbsolute = absRegex.test(href)
  if (isAbsolute) return new URL(href)
  const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN
  const basePathOverride = String(_basePathOverride)
  const isBasePathAbsolute = absRegex.test(basePathOverride)
  const basePathMap = {
    current: typeof window === 'undefined' ? ORIGIN : location.href.replace(/\/$/, ''),
    origin: ORIGIN,
    custom: isBasePathAbsolute ? basePathOverride : `${ORIGIN}${basePathOverride.replace(/\/$/, '')}`,
  }
  const basePath = basePathMap[relativeTo]
  const relativeHref = href.replace(/^\//, '')
  const fullHref = basePath + '/' + relativeHref
  return new URL(fullHref)
}

/**
 * Converts PascalCase (and camelCase) to a capitalized title with spaces.
 * (e.g., "HelloMyNameIsJon" -> "Hello My Name Is Jon")
 * @param {string} str - The given PascalCase string
 * @returns {string} - The converted string with spaces
 */
export const pascalToSpaces = str => {
  const pascalRegex = /([A-Z1-9])([A-Z1-9])([a-z])|([a-z])([A-Z1-9])/g
  return str
    .replace(pascalRegex, '$1$4 $2$3$5')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * A pure alternative to `Array.prototype.splice`, to avoid mutation
 * @param {unknown[]} array - The array to splice
 * @param {number} start - The start index
 * @param {number} deleteCount - The number of items to delete
 * @param  {...unknown} items - The items to insert
 * @returns {unknown[]} - The resulting spliced array
 */
export const pureSplice = (array, start, deleteCount, ...items) => {
  const newArray = [...array]
  newArray.splice(start, deleteCount, ...items)
  return newArray
}
