export default {
  // development: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './src/config/database/db.sqlite'
  //   },
  //   migrations: {
  //     directory: './src/config/database/migrations'
  //   },
  //   seeds: {
  //     directory: './src/config/database/seeds'
  //   },
  //   useNullAsDefault: true
  // },

  // test: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './src/config/database/test.sqlite'
  //   },
  //   migrations: {
  //     directory: './src/config/database/migrations'
  //   },
  //   useNullAsDefault: true
  // },

  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'ko35',
      database: 'test_matricula'
    },
    migrations: {
      directory: './src/config/database/migrations'
    },
    seeds: {
      directory: './src/config/database/seeds'
    }
  },

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'ko35',
      database: 'dev_matricula'
    },
    migrations: {
      directory: './src/config/database/migrations'
    },
    seeds: {
      directory: './src/config/database/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'your_database_user',
      password: 'your_database_password',
      database: 'myapp_test'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/config/database/migrations'
    }
  }
}
