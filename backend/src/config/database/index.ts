import configuration from './config'
import knex from 'knex'

const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development

export default knex(config)
