import { createConnection } from 'mongoose'
import * as SEED_DATA from './seed-data'
import getModels from './models'
import * as apiMethods from './api'

export default async () => {

  // establish the connection to the database
  const {
    MONGO_CONNECTION_STRING,
    ENVIRONMENT,
    NEXT_PUBLIC_ORIGIN,
    RESEED_DATA,
  } = process.env

  // const RESEED_DATA = 'true'

  const isDev = ENVIRONMENT === 'development'
  const isTest = false // NEXT_PUBLIC_ORIGIN === 'https://<app-id>.ondigitalocean.app'
  const reseedData = RESEED_DATA === 'true'

  const connection = await createConnection(MONGO_CONNECTION_STRING, {
    ...(isDev ? {} : { tlsCAFile: `${process.cwd()}/ca-certificate.crt` }),
  })

  // get all models exported from the models folder
  const models = getModels(connection)

  // inject dependencies for all api methods exported from the api folder
  const api = Object.entries(apiMethods).reduce((queryMethods, [name, inject]) => {
    queryMethods[name] = inject(models)
    return queryMethods
  }, {})

  // drop collections if reseed data is explicitly enabled
  if ((isDev || isTest) && reseedData) {
    console.log('purging all data to reseed from scratch...')
    const dropPromises = []
    for (const name in models) {
      const doDropData = async () => {
        const numOfDocuments = await models[name].countDocuments().exec()
        if (!numOfDocuments) return
        const { collectionName } = models[name].collection
        console.log(`dropping ${collectionName}...`)
        await connection.collections[collectionName].drop()
      }
      dropPromises.push(doDropData())
    }
    await Promise.all(dropPromises)
  }

  // seed data for the first time, if provided
  if (isDev || isTest || reseedData) {
    console.log('checking if data needs seeded...')
    const seedPromises = []
    for (const name in models) {
      const doSeedData = async () => {
        const numOfDocuments = await models[name].countDocuments().exec()
        if ((reseedData || numOfDocuments === 0) && SEED_DATA[name]) {
          console.log(`seeding ${name}s...`)
          const savePromises = []
          for (const data of SEED_DATA[name]) {
            savePromises.push(async () => {
              const Model = models[name]
              const model = new Model(data)
              return await model.save()
            })
          }
          await Promise.all(savePromises)
        }
      }
      seedPromises.push(doSeedData())
    }
    await Promise.all(seedPromises)
    console.log('done.')
  }

  return {
    ...api,
    close: async () => connection.close(),
  }
}
