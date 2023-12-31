import { Config, JsonDB } from "node-json-db";

export class DomainsCache extends JsonDB {
  constructor() {
    super(new Config("./cache/domains.json", true, true));
  }
}

export class DataCache extends JsonDB {
  constructor() {
    super(new Config("./cache/data.json", true, true));
  }
}
