/**
 * @jest-environment jsdom
 */

import { bool, checkType, getClassName, getType, parseVariables, mergeDeep, getURL } from './general';

describe('getClassName() gets the full class string from a list of conditional classes', () => {

  test('classes mapped to false are excluded, classes mapped to true are included', () => {
    const className1 = getClassName({
      'button': true,
      'button--active': false,
      'button--primary': true,
    });
    expect(className1).toBe('button button--primary');
  });

  test('a class added after the map is appended unconditionally', () => {
    const className2 = getClassName({
      'button': true,
      'button--active': false,
    }, 'button--primary');
    expect(className2).toBe('button button--primary');
  });

  test('multiple classes added after the map are appended unconditionally', () => {
    const className3 = getClassName({
      button: true,
    }, 'button--active', 'button--primary');
    expect(className3).toBe('button button--active button--primary');
  });

});

describe('getType() returns the type as a string, including null and specific classes', () => {

  test('detects primitive types', () => {
    const str = 'str';
    const num = 0;
    const bool = false;
    const undef = undefined;
    const symbol = Symbol('sym');
    const bigint = 999999999999999999999n;
    expect(getType(str)).toBe('string');
    expect(getType(num)).toBe('number');
    expect(getType(bool)).toBe('boolean');
    expect(getType(undef)).toBe('undefined');
    expect(getType(symbol)).toBe('symbol');
    expect(getType(bigint)).toBe('bigint');
  });

  test('detects null', () => {
    const n = null;
    expect(getType(n)).toBe('null');
  });

  test('detects object and array literals', () => {
    const arr = [];
    const obj = {};
    expect(getType(arr)).toBe('array');
    expect(getType(obj)).toBe('object');
  });

  test('detects class constructors as types', () => {
    class MyType {}
    const myType = new MyType();
    expect(getType(myType)).toBe('mytype');
  });

});

describe('checkType() checks if the provided value matches the provided type', () => {

  test('checks value type against a single provided type', () => {
    const num = 0;
    expect(checkType(num, 'number')).toBe(true);
    expect(checkType(num, 'boolean')).toBe(false);
  });

  test('checks value type against many possible types', () => {
    const num = 0;
    expect(checkType(num, ['number', 'boolean'])).toBe(true);
    expect(checkType(num, ['boolean', 'string'])).toBe(false);
  });

  test('returns an error if a string or array of strings was not provided in the second argument', () => {
    const num = 0;
    expect(checkType(num, true)).toBeInstanceOf(TypeError);
  });

});

describe('bool() converts anything (namely strings) into a true boolean', () => {

  test('converts strings to true or false', () => {
    const trueStr = 'true';
    const falseStr = 'false';
    const emptyStr = '';
    expect(bool(trueStr)).toBe(true);
    expect(bool(falseStr)).toBe(false);
    expect(bool(emptyStr)).toBe(false);
  });

  test('converts other truthy/falsey values to true or false', () => {
    const num = 0;
    const obj = {};
    const n = null;
    expect(bool(num)).toBe(false);
    expect(bool(obj)).toBe(true);
    expect(bool(n)).toBe(false);
  });

  test('returns an error if the string contains an unusual value', () => {
    const trueStr = '  TRUE ';
    const falseStr = ' FALSE  ';
    const yesStr = 'yes';
    const noStr = 'no';
    expect(bool(trueStr)).toBe(true);
    expect(bool(falseStr)).toBe(false);
    expect(bool(yesStr)).toBeInstanceOf(TypeError);
    expect(bool(noStr)).toBeInstanceOf(TypeError);
  });

});

describe('mergeDeep() merges subproperties all the way down the object tree', () => {

  test('performs a shallow merge', () => {
    const obj1 = { test1: 'test1' };
    const obj2 = { test2: 'test2' };
    const resultObj = {
      test1: 'test1',
      test2: 'test2',
    };
    expect(mergeDeep(obj1, obj2)).toEqual(resultObj);
  });

  test('performs a deep merge', () => {
    const obj1 = { test1: { test1: 'test1' } };
    const obj2 = { test1: { test2: 'test2' } };
    const resultObj = {
      test1: {
        test1: 'test1',
        test2: 'test2',
      },
    };
    expect(mergeDeep(obj1, obj2)).toEqual(resultObj);
  });

  test('performs a complex merge', () => {
    const obj1 = {
      test1: {
        arr: ['one', 'two'],
        arr2: [{ test1: 'test1' }, { test2: 'test2' }],
        obj: { test1: 'test1' },
      },
      test2: { test1: 'test1' },
    };
    const obj2 = {
      test1: {
        arr: ['three', 'four'],
        arr2: [{ test1: 'testa' }, { test2: 'testb' }],
        obj: { test2: 'test2' },
      },
      test2: { test2: 'test2' },
    };
    const expectedResult = {
      test1: {
        arr: ['one', 'two', 'three', 'four'],
        arr2: [{ test1: 'testa' }, { test2: 'testb' }],
        obj: { test1: 'test1', test2: 'test2' },
      },
      test2: { test1: 'test1', test2: 'test2' },
    };
    const actualResult = mergeDeep(obj1, obj2);
    expect(actualResult).toEqual(expectedResult);
  });

});

describe('parseVariables() parses all the variables in each property, provided the locale and variable mappings', () => {

  test('parses the variables in strings marked by curly braces', () => {
    const localeData = { footer: { copyright: 'Copyright {year} All Rights Reserved.' } };
    const locale = 'en-US';
    const variables = { 'en-US': { year: '2022' } };
    const resultObj = { footer: { copyright: 'Copyright 2022 All Rights Reserved.' } };
    expect(parseVariables(localeData, locale, variables)).toEqual(resultObj);
  });

});

describe('getURL() creates a full absolute URL object from any href string, relative or absolute', () => {

  test('gets an absolute URL from a relative path', () => {
    process.env.NEXT_PUBLIC_ORIGIN = 'http://localhost:3000';
    location.href = 'http://localhost:3000';
    expect(getURL('/test').href).toBe('http://localhost:3000/test');
  });

  test('gets a URL based on the current path', () => {
    process.env.NEXT_PUBLIC_ORIGIN = 'http://localhost:3000';
    location.href = 'http://localhost:3000/test';
    expect(getURL('/test').href).toBe('http://localhost:3000/test/test');
  });

  test('gets a URL based on the origin', () => {
    process.env.NEXT_PUBLIC_ORIGIN = 'http://localhost:3000';
    const options = { relativeTo: 'origin' };
    location.href = 'http://localhost:3000/test';
    expect(getURL('/test', options).href).toBe('http://localhost:3000/test');
  });

  test('gets a URL based on a custom base path', () => {
    process.env.NEXT_PUBLIC_ORIGIN = 'http://localhost:3000';
    const options = {
      relativeTo: 'custom',
      basePath: '/test2',
    };
    location.href = 'http://localhost:3000/test';
    expect(getURL('/test', options).href).toBe('http://localhost:3000/test2/test');
  });

});
