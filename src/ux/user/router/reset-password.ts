import { NextHandleFunction } from "connect";
import { jsonBody } from "../../../utils/http-request"
import { alwaysDelay } from "../../../utils/promise"
import { castToObject } from "../../../utils/JSON";
import {
  userAndServSchema, codeSchema, passwordSchema
} from "../schemas";
import { prepNewPassword } from "../util/prepNewPassword"
import { notyifyOfNewUser } from "../../../global-vars/team-notifications";
import { events as userEvents } from "../events";
import {
  useridToJwt
} from "../util/userid-to-jwt"

import { ERRORS } from "../../../constants/errors";

export const resetPassword: NextHandleFunction = async (req, res, next)=>{
  // Done because some hackers "figure out" how far they've gotten within a function
  // Based on response time
  // Thus, if we always make it slow, they should have a harder time
  // Figuring out how far they've gotten.
  // Three seconds might be too little
  // We keep the response second because
  // if theres an error, we want the same delay as if it was success
  alwaysDelay(
    3 * 1000,
    async ()=>{
      const json = castToObject(await jsonBody(req), ERRORS.BAD_FORM);
      if(typeof json.code !== "string") throw ERRORS.BAD_FORM
      if(typeof json.email !== "string") throw ERRORS.BAD_FORM
      const user = await userAndServSchema.getByKey("email", json.email);
      if(!user){
        console.error("No email found, it might have been deleted");
        throw ERRORS.BAD_FORM
      }
      const codes = await codeSchema.query({
        code: json.code,
        userId: user.id,
      })
      if(codes.length === 0){
        console.error("they are searching for a missing code")
        throw ERRORS.BAD_FORM
      }

      const hash = await prepNewPassword(json);

      const passwordSet = await passwordSchema.upsert(user.id, {
        userId: user.id,
        email: json.email,
        hash: hash,
      })
      if(passwordSet.v === 0){
        notyifyOfNewUser(json.email)
        userEvents.emit("new user", user);
      }
      const [signedToken, protectedInfo] = await Promise.all([
        useridToJwt(user.id),
        userAndServSchema.get(user.id),
        codeSchema.delete(codes[0].id),
      ]);
      return { signedToken, protectedInfo };
    }, ({ signedToken, protectedInfo })=>{
      res.statusCode = 200;
      res.end({
        status: "ok",
        token: signedToken,
        info: protectedInfo
      });
    }, (e)=>{
      next(e);
    }
  )
}
