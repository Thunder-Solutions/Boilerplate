const OLD_ENV = process.env

beforeAll(() => {
  const OLD_LOC = window.location
  delete window.location
  window.location = Object.assign({}, OLD_LOC)
  const url = Object.assign({}, new URL('http://localhost:3000'))
  Object.keys(url).forEach(prop => (window.location[prop] = url[prop]))
})

beforeEach(() => {
  jest.resetModules()
  process.env = { ...OLD_ENV }
})

afterEach(() => {
  process.env = OLD_ENV
})
