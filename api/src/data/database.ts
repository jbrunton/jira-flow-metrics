import { Config, JsonDB } from 'node-json-db';

export const cache = new JsonDB(new Config('./cache/db.json', true, true));
