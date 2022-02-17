import { ErrorContext } from "../../../global-vars/team-notifications"
import { UserAndServerType, userAndServSchema } from "../../user";
import { getTime } from "../../../utils/time";

import { ERRORS } from "../../../constants/errors";

import { DataDocument } from "../../../global-vars/database";
import { isProduction } from "../../../constants/production";

import { paymentStatusSchema } from "../schemas";

const ERROR_CONTEXT: ErrorContext = {
  location: "server",
  file: __filename,
  function: "the file",
}

export async function findOrCreatePaymentStatusByIaphubId(iaphubId: string){
  return (
    0
    || await paymentStatusSchema.get(iaphubId)
    || createPaymentStatusByIaphubId(iaphubId)
  );
}

async function createPaymentStatusByIaphubId(iaphubId: string){
  return await paymentStatusSchema.set(iaphubId, {
    iaphubId: iaphubId,
    userId: "",
    status: "new",
    startDate: await getTime(),
    sandbox: isProduction ? false : true,
    timeBalance: 0
  })
}

export async function findOrCreatePaymentStatusByUserId(userId: string){
  var paymentStatus = await paymentStatusSchema.getByKey("userId", userId);
  if(paymentStatus) return paymentStatus;
  const protectedInfo = await userAndServSchema.get(userId)
  if(typeof protectedInfo === "undefined"){
    throw {
      ...ERRORS.SERVER_ERROR,
      internal: {
        context: {
          ...ERROR_CONTEXT,
          function: "userAndServSchema.get"
        },
        arg: [userId],
        err: "No protected info found for user"
      }
    }
  }
  paymentStatus = await tryToPatchPaymentStatusByUserId(userId, protectedInfo);
  if(paymentStatus) return paymentStatus;
  return createPaymentStatusByUserId(userId, protectedInfo);
}

async function tryToPatchPaymentStatusByUserId(userId: string, info: DataDocument<UserAndServerType>){
  return await paymentStatusSchema.patch(info.iaphubId, {
    userId: userId,
  });
}

export async function createPaymentStatusByUserId(userId: string, info: DataDocument<UserAndServerType>){
  const newDoc = await paymentStatusSchema.set(info.iaphubId, {
    iaphubId: info.iaphubId,
    userId: userId,
    status: "new",
    startDate: await getTime(),
    sandbox: isProduction ? false : true,
    timeBalance: 0
  })
  console.log(
    "payment schema set:", await paymentStatusSchema.get(info.iaphubId)
  );
  return newDoc;
}
