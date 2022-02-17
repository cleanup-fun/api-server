import { NextHandleFunction } from "connect";
import { emptyCallback } from "../../../utils/function";
import { userProtected } from "./userProtected"
import { ReqWithUser } from "../types";

import { ERRORS } from "../../../constants/errors";

export function roleProtected(role: string): NextHandleFunction{
  return (reqUncasted, res, next)=>{
    const req = reqUncasted as ReqWithUser;
    (!req.user ? userProtected : emptyCallback)(req, res, (e)=>{
      if(e) return next(e);
      if(!req.user.roles.includes(role)){
        next(ERRORS.FORBIDDEN)
      }
      next()
    })
  }
}
