import { NextHandleFunction } from "connect";
import { uniqueId, randomNumbers } from "../../../utils/string";
import { testEmail } from "../../../validators/user";
import { NO_REPLY_EMAIL } from "../../../constants/email";
import { mailer } from "../../../global-vars/mailer";
import { jsonBody } from "../../../utils/http-request"
import { castToObject } from "../../../utils/JSON";
import {
  publicSchema, userAndServSchema, jwtSchema, codeSchema
} from "../schemas";

import { ERRORS } from "../../../constants/errors";

export const registerOrForgot: NextHandleFunction = async (req, res, next)=>{
  try {
    const json = castToObject(await jsonBody(req), ERRORS.BAD_FORM);
    console.log("json casted");
    if(typeof json.email !== "string") throw ERRORS.BAD_FORM
    console.log("has email");
    const { email } = json;
    testEmail(email, ERRORS.BAD_FORM);
    console.log("is valid email");

    const user = await userAndServSchema.getByKey("email", email);
    const code = randomNumbers(32, 32);
    if(user === void 0){
      const publicUser = await publicSchema.add({
        name: "No name selected yet",
        roles: ["user"],
      })
      const jwtId = uniqueId();
      await Promise.all([
        userAndServSchema.set(publicUser.id, {
          userId: publicUser.id,
          email: json.email,
          iaphubId: uniqueId(),
          deleteKey: ""
        }),
        jwtSchema.set(jwtId, {
          jwtId: jwtId,
          userId: publicUser.id
        }),
        await codeSchema.set(publicUser.id, {
          code: code,
          userId: publicUser.id
        })
      ]);
    } else {
      await codeSchema.patch(user.id, {
        code: code,
      })
    }
    await mailer.sendMail({
      from: "noreply@cleanupfun.app",
      to: email,
      subject: "Use this code to set your password",
      text: [
        "In the app you should go to the \"Set Password\" form.",
        "Provide this code (" + code + ") underneath the email.",
        "From there you can set your password."
      ].join("\n")
    })
    res.end({
      status: "ok",
      nextStep: "check email"
    })
  }catch(e){
    next(e)
  }
}
