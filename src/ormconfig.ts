import {
   PostgresConnectionOptions
} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from "./db/entity/User";
import { Search } from "./db/entity/Search";


const typeOrmConfig = {
   name: "test",
   type: "postgres",
   host: process.env.HOST,
   port: parseInt(process.env.PORT!),
   username: process.env.USER,
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
   synchronize: false,
   logging: false,
   entities: [
      User,
      Search,
   ],
   migrations: ['./db/migrations/*.js'],
   cli:
   {
      "migrationsDir": "migration"
   }

}

export { typeOrmConfig };
