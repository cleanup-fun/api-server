import { delay } from "./promise";

// We do this because I don't know if node's internal clock can truelly be trusted
// While having a dedicated server just for time and/or cron jobs sounds reasonable to me

export async function getTime(){
  await delay(100);
  return Date.now();
}
