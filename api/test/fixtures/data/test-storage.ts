import { Config, JsonDB } from "node-json-db";

export class TestDomainsCache extends JsonDB {
  constructor() {
    super(new Config("./cache/domains.json", false, true));
  }
}

export class TestDataCache extends JsonDB {
  constructor() {
    super(new Config("./cache/data.json", false, true));
  }
}
