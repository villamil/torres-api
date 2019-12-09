import { createConnection, Connection } from "typeorm";
import { CONFIG } from "./config";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

export async function connectDB(
  entity?: string
): Promise<Connection | undefined> {
  const options: MysqlConnectionOptions = {
    type: "mysql",
    host: CONFIG.DB_HOST,
    port: CONFIG.DB_PORT,
    username: CONFIG.DB_USER,
    password: CONFIG.DB_PASSWORD,
    database: CONFIG.DB_NAME || entity,
    entities: [`${__dirname}/models/**{.ts,.js}`],
    synchronize: CONFIG.DB_SYNC,
    cli: {
      entitiesDir: `${__dirname}/models`
    }
  };

  return await createConnection(options);
}
