import { NextHandleFunction } from "connect";
import { ReqWithUser } from "../types";
import {
  useridToJwt
} from "../util/userid-to-jwt"

export const refreshToken: NextHandleFunction = async (reqUncasted, res, next)=>{
  try {
    const req = reqUncasted as ReqWithUser;
    const signedToken = await useridToJwt(req.user.id)
    res.statusCode = 200;
    res.end({
      status: "ok",
      token: signedToken
    });
  }catch(e){
    next(e);
  }
}
