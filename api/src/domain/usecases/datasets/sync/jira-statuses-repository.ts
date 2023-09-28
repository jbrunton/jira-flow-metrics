import { Status } from "@entities/issues";

export abstract class JiraStatusesRepository {
  abstract getStatuses(): Promise<Status[]>;
}
