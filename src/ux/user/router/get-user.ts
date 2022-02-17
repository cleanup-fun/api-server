import { NextHandleFunction } from "connect";
import { ReqWithParams } from "../../../types/http";
import { publicSchema, userAndServSchema } from "../schemas";

import { ERRORS } from "../../../constants/errors";
import { ReqWithUser } from "../types";

export const getUsers: NextHandleFunction = async (_, res, next)=>{
  try {
    const users = await publicSchema.query({});
    res.statusCode = 200
    res.end({
      status: "ok",
      user: users
    })
  }catch(e){
    next(e)
  }
}

export const getUser: NextHandleFunction = async (reqUncasted, res, next)=>{
  try {
    const req = reqUncasted as ReqWithParams;
    if(!req.params) throw ERRORS.NOT_FOUND;
    const userId = req.params.userId
    if(!userId) throw ERRORS.NOT_FOUND;
    const user = publicSchema.get(userId);
    if(!user) throw ERRORS.NOT_FOUND
    res.statusCode = 200
    res.end({
      status: "ok",
      user: user
    })
  }catch(e){
    next(e)
  }
}

export const getSelf: NextHandleFunction = async (reqUncasted, res, next)=>{
  try {
    const req = reqUncasted as ReqWithUser;
    const protectedInfo = await userAndServSchema.get(req.user.id);
    res.statusCode = 200
    res.end({
      status: "ok",
      user: req.user,
      info: protectedInfo
    })
  }catch(e){
    next(e)
  }
}
