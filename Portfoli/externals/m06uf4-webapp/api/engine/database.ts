import { knex } from "knex";

class Database {
  db!: knex.Knex
  async start() {
    let db = knex({
      client: "pg",
      connection: {
        host: "127.0.0.1",
        port: 5432,
        user: "postgres",
        password: "badia123",
        database: "Sakila"
      }
    })
    this.db = db
  }
}

let db = new Database()
export default db