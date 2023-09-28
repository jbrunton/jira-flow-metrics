import { Field } from "@entities/issues";

export abstract class JiraFieldsRepository {
  abstract getFields(): Promise<Field[]>;
}
