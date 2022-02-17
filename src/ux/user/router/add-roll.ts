import { NextHandleFunction } from "connect";
import { jsonBody } from "../../../utils/http-request"
import { castToObject } from "../../../utils/JSON";
import {
  publicSchema,
} from "../schemas";

import { ERRORS } from "../../../constants/errors";
import { ReqWithUser } from "../types";
import { events as userEvents } from "../events";

export const addRoll: NextHandleFunction = async (reqUncasted, res, next)=>{
  try {
    const req = reqUncasted as ReqWithUser;
    const json = castToObject(await jsonBody(req), ERRORS.BAD_FORM);
    if(typeof json.roll !== "string") throw ERRORS.BAD_FORM
    if(typeof json.userId !== "string") throw ERRORS.BAD_FORM;
    const user = await publicSchema.get(json.userId);
    if(!user) throw ERRORS.NOT_FOUND;
    if(user.roles.indexOf(json.roll) !== -1){
      throw ERRORS.ALREADY_EXISTS
    }
    const oldRoles = user.roles;
    const newRoles = user.roles.concat([ json.roll ]);
    await publicSchema.patch(user.id, {
      roles: newRoles
    })
    res.statusCode = 200
    res.end({
      status: "ok",
      nextStep: "Your choice"
    })
    userEvents.emit("user roles changed", user, oldRoles, newRoles)
  }catch(e){
    next(e)
  }
}
