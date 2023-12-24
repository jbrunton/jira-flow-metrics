import { createHash } from "crypto";

export const createId = <T>(object: T): string => {
  return createHash("md5")
    .update(JSON.stringify(object))
    .digest("base64url")
    .substring(0, 12);
};
