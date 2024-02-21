const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "db4free.net",
      user: "andrew1",
      password: "843cb920",
      database: "database_daw",
      connectTimeout: 60000
    },
    listPerPage: 10,
    multipleStatements: true
  };
  module.exports = config;