import { bool, mergeDeep, parseVariables } from 'utilities'
import variables from 'locales/variables'

const getLocaleData = ({
  group = 'page',
  id = 'home',
  locale = 'en-US',
  global = 'false',
}) => {
  const path = bool(global) ? 'global' : `${group}/${id}`
  const fallbackLocale = require(`locales/${path}/en-US.json`)
  const overrideLocale = require(`locales/${path}/${locale}.json`)
  const localeData = mergeDeep(fallbackLocale, overrideLocale)
  const parsedLocaleData = parseVariables(localeData, locale, variables)
  return parsedLocaleData
}

const handler = async (req, res) => {
  try {
    const localeData = getLocaleData(req.query)
    res.status(200).json(localeData)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locale data', message: error.message })
  }
}

export default handler
