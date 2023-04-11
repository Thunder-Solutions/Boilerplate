import { GenericObj } from './types';

/**
 * Apply classes dynamically based on boolean expressions
 */
export const getClassName = (classMap: { [className: string]: boolean }, ...classes: string[]): string => {
  const classArr = [
    ...Object.entries(classMap).reduce((classes, [_class, applyClass]) => {
      if (applyClass) classes.push(_class);
      return classes;
    }, []),
    ...classes,
  ];
  return classArr.join(' ');
};

/**
 * Includes null and all nonprimitive types
 */
export const getType = (val: unknown): typeof val => {
  if (val === null) return 'null';
  if (typeof val === 'object') return val.constructor.name.toLowerCase();
  return typeof val;
};

/**
 * A safe alternative to `typeof`, including null and all nonprimitive types
 */
export const checkType = (val: unknown, type: string | string[]): boolean | TypeError => {
  const validString = getType(type) === 'string';
  const validArray = Array.isArray(type) && type.every(t => getType(t) === 'string');
  if (!validString && !validArray) return new TypeError('`checkType()` expects either a string or array of strings in the second argument');
  if (validString) return getType(val) === type;
  if (validArray) return type.some(t => getType(val) === t);
};

/**
 * Converts any value to a boolean, but non-empty strings must read "true" or "false"
 */
export const bool = (val: unknown): boolean | TypeError => {
  const isString = typeof val === 'string';
  const _val = isString ? val.toLowerCase().trim() : val;
  const strValues = ['', 'true', 'false'];
  if (typeof _val === 'string' && !strValues.includes(_val)) {
    return new TypeError('Could not convert string to boolean because the string was not empty and neither "true" nor "false"');
  }
  return isString ? _val === 'true' : Boolean(_val);
};

/**
 * Merges subproperties, as opposed to `{ ...obj1, ...obj2 }` which replaces subproperties entirely.
 */
export const mergeDeep = (fallback: GenericObj, override: GenericObj): GenericObj => Object.keys(fallback).reduce((outputObj, key) => {
  const obj1 = checkType(fallback[key], 'object') ? fallback[key] as GenericObj : null;
  const obj2 = checkType(override[key], 'object') ? override[key] as GenericObj : null;
  const arr1 = checkType(fallback[key], 'array') ? fallback[key] as unknown[] : null;
  const arr2 = checkType(override[key], 'array') ? override[key] as unknown[] : null;;
  if (obj1 && obj2) {
    outputObj[key] = mergeDeep(obj1, obj2);
  } else if (arr1 && arr2) {

    // special treatment for arrays
    const isObjArr = (arr: unknown[]): boolean => arr.every(i => checkType(i, 'object'));
    const objArr1 = isObjArr(arr1) ? arr1 as GenericObj[] : null
    const objArr2 = isObjArr(arr2) ? arr2 as GenericObj[] : null;
    if (objArr1 && objArr2) {

      // merge all objects inside arrays
      outputObj[key] = objArr1.map((obj, idx) => mergeDeep(obj, objArr2[idx]));
    } else {

      // shallow merge arrays of primitives
      outputObj[key] = [...arr1, ...arr2];
    }
  } else {
    outputObj[key] = override[key] ?? fallback[key];
  }
  return outputObj;
}, { ...fallback, ...override });

/**
 * Parses a single string's variables provided the locale and variable mappings
 */
const parseVariablesInString = (str: string, locale: string, variables: GenericObj<GenericObj<string>>): string => {
  const varKV = Object.entries(variables[locale]);
  return varKV.reduce((outputStr, [key, value]) => {
    outputStr = outputStr.replace(key, value)
      .replace(/(?<!\\)({|})/g, '')
      .replace(/\\/g, '');
    return outputStr;
  }, str);
};

type DeepStringObject = {
  [key: string]: string | DeepStringObject,
}


/**
 * Parses all of the variables in the provided object's values
 */
export const parseVariables = (localeData: DeepStringObject, locale: string, variables: GenericObj<GenericObj<string>>): DeepStringObject => {
  const init = checkType(localeData, 'array') ? [] : {};
  return Object.entries(localeData).reduce((parsedLocaleData, [key, value]) => {
    if (typeof value === 'string') parsedLocaleData[key] = parseVariablesInString(value, locale, variables);
    else parsedLocaleData[key] = parseVariables(value, locale, variables);
    return parsedLocaleData;
  }, init);
};

type GetURLOptions = {
  relativeTo?: 'current' | 'origin' | 'custom',
  basePath?: string,
};

/**
 * This function quickly creates a URL object from any href string
 */
export const getURL = (href: string, { relativeTo = 'current', basePath: _basePathOverride = '' }: GetURLOptions = {}): URL => {
  if (!href) return null;
  const absRegex = /^([^/]+?)\/\//;
  const isAbsolute = absRegex.test(href);
  if (isAbsolute) return new URL(href);
  const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN;
  const basePathOverride = String(_basePathOverride);
  const isBasePathAbsolute = absRegex.test(basePathOverride);
  const basePathMap = {
    current: typeof window === 'undefined' ? ORIGIN : location.href.replace(/\/$/, ''),
    origin: ORIGIN,
    custom: isBasePathAbsolute ? basePathOverride : `${ORIGIN}${basePathOverride.replace(/\/$/, '')}`,
  };
  const basePath = basePathMap[relativeTo];
  const relativeHref = href.replace(/^\//, '');
  const fullHref = basePath + '/' + relativeHref;
  return new URL(fullHref);
};

/**
 * Converts PascalCase (and camelCase) to a capitalized title with spaces.
 * (e.g., "HelloMyNameIsJon" -> "Hello My Name Is Jon")
 */
export const pascalToSpaces = (str: string): string => {
  const pascalRegex = /([A-Z1-9])([A-Z1-9])([a-z])|([a-z])([A-Z1-9])/g;
  return str
    .replace(pascalRegex, '$1$4 $2$3$5')
    .replace(/\b\w/g, c => c.toUpperCase());
};

/**
 * A pure alternative to `Array.prototype.splice`, to avoid mutation
 */
export const pureSplice = (array: unknown[], start: number, deleteCount: number, ...items: unknown[]): unknown[] => {
  const newArray = [...array];
  newArray.splice(start, deleteCount, ...items);
  return newArray;
};
