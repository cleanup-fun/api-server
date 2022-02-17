import { IncomingMessage } from "http";
import { DataDocument } from "../../global-vars/database";

import { PublicType } from "./schemas";

export type ReqWithUser = IncomingMessage & {
  user: DataDocument<PublicType>,
  jwt: { id: string }
}
