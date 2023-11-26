import { ConfigWithAdapter, IAdapter, JsonAdapter, JsonDB } from "node-json-db";

class MemoryAdapter implements IAdapter<string> {
  private data: string;

  async readAsync() {
    return this.data;
  }

  async writeAsync(data: string) {
    this.data = data;
  }
}

export class TestDomainsCache extends JsonDB {
  constructor() {
    super(new ConfigWithAdapter(new JsonAdapter(new MemoryAdapter())));
  }
}

export class TestDataCache extends JsonDB {
  constructor() {
    super(new ConfigWithAdapter(new JsonAdapter(new MemoryAdapter())));
  }
}
