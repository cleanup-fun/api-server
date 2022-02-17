import { NextHandleFunction } from "connect";
import { findOrCreatePaymentStatusByUserId } from "../util/find-or-create-payment-status";
import { getTime } from "../../../utils/time";

import { ReqWithUser } from "../../user";

export const paymentStatus: NextHandleFunction = async (reqUncasted, res, next)=>{
  try {
    const req = reqUncasted as ReqWithUser;
    const [status, now] = await Promise.all([
      findOrCreatePaymentStatusByUserId(req.user.id),
      getTime()
    ]);
    res.statusCode = 200;
    res.end({
      status: "ok",
      paymentStatus: status,
      now
    })
  }catch(e){
    next(e)
  }
}
