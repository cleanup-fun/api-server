import { EventEmitter } from "events"
import { ErrorContext, notifyOfInternalError } from "./team-notifications/errors";

process.on("uncaughtException", (e)=>{
  globalEvents.emit("error", e, "uncaught exception")
})

process.on("unhandledRejection", (e)=>{
  globalEvents.emit("error", e, "unhandled rejection")
})

export const globalEvents = new EventEmitter();

const ERROR_CONTEXT: ErrorContext = {
  location: "server",
  file: "global",
  function: "unknown",
}


globalEvents.on("error", (e, type)=>{
  notifyOfInternalError({
    ...ERROR_CONTEXT,
    function: type || ERROR_CONTEXT.function
  }, [], e);
})
