import { NextHandleFunction } from "connect";
import { isGoodUsername } from "../../../validators/user";
import { jsonBody } from "../../../utils/http-request"
import { castToObject } from "../../../utils/JSON";
import {
  publicSchema
} from "../schemas";

import { ERRORS } from "../../../constants/errors";
import { ReqWithUser } from "../types";
import { events as userEvents } from "../events";

export const changeName: NextHandleFunction = async (reqUncasted, res, next)=>{
  try {
    const req = reqUncasted as ReqWithUser;
    const json = castToObject(await jsonBody(req), ERRORS.BAD_FORM);
    if(typeof json.name !== "string") throw ERRORS.BAD_FORM;
    isGoodUsername(json.name);
    const user = await publicSchema.patch(req.user.id, {
      name: json.name
    });
    if(!user) throw ERRORS.NOT_FOUND;
    res.statusCode = 200
    res.end({
      status: "ok",
      nextStep: "Your choice"
    })
    userEvents.emit("user name changed", req.user)
  }catch(e){
    next(e)
  }
}
