import { IncomingMessage } from "http"

export type ReqWithParams = IncomingMessage & { params?: {[key: string]: string } };
