// Update with your config settings.

module.exports = {
    local: {
        client: 'mysql',
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_DB,
            port:33306,
            dateStrings: true
        }
    },

    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_DB,
            port:process.env.DATABASE_PORT || 3306,
            dateStrings: true
        }
    },
};
