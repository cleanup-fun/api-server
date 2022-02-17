import { NextHandleFunction } from "connect";
import {
  publicSchema, jwtSchema
} from "../schemas";
import { verifyToken } from "../../../global-vars/jwt";
import { JSON_Unknown } from "../../../types/JSON";

import { ERRORS } from "../../../constants/errors";
import { ReqWithUser } from "../types";

const tokenExtractor = /\s*[Bb][Ee][Aa][Rr][Ee][Rr]\s+([^\s].*[^\s])\s*$/;
export const userProtected: NextHandleFunction = async (reqUncasted, _, next)=>{
  try {
    const authHeader = reqUncasted.headers["authorization"];
    if(typeof authHeader !== "string"){
      throw "No Auth Header";
    }
    const extracted = tokenExtractor.exec(authHeader)
    if(extracted === null) throw "Bad authHeader";
    const payload = await verifyToken<JSON_Unknown>(extracted[1]);
    if(typeof payload !== "object"){
      throw "bad payload";
    }
    if(Array.isArray(payload)){
      throw "payload is array";
    }
    if(typeof payload.id !== "string"){
      throw "no id in payload";
    }
    const jwtPayload = { id: payload.id };
    const jwt = await jwtSchema.get(payload.id);
    if(jwt === void 0){
      throw "no jwt associated to this user";
    }
    const user = await publicSchema.get(jwt.userId);
    if(!user){
      throw "Found jwt but no user";
    }
    const req = reqUncasted as ReqWithUser;
    req.user = user;
    req.jwt = jwtPayload;
    next();
  }catch(e){
    console.error("bad user:", e);
    next(ERRORS.FORBIDDEN);
  }
}
