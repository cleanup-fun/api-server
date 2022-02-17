import { NextHandleFunction } from "connect";
import { jsonBody } from "../../../utils/http-request"
import { castToObject } from "../../../utils/JSON";
import {
  passwordSchema, userAndServSchema
} from "../schemas";
import { prepNewPassword } from "../util/prepNewPassword";
import { testPassword } from "../util/testPassword";
import { ERRORS } from "../../../constants/errors";
import { ReqWithUser } from "../types";

export const changePassword: NextHandleFunction = async (reqUncasted, res, next)=>{
  try {
    const req = reqUncasted as ReqWithUser;
    const user = req.user;
    const json = castToObject(await jsonBody(req), ERRORS.BAD_FORM);
    const protectedInfo = await userAndServSchema.get(user.id);
    if(!protectedInfo) throw ERRORS.BAD_FORM;
    await testPassword(protectedInfo.email, json.originalPassword);
    const hash = await prepNewPassword(json)
    await passwordSchema.patch(user.id, {
      hash: hash
    })
    res.statusCode = 200;
    res.end({
      status: "ok"
    })
  }catch(e){
    next(e);
  };
}
