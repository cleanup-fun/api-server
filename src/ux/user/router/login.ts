import { NextHandleFunction } from "connect";
import { ErrorContext } from "../../../global-vars/team-notifications"
import { jsonBody } from "../../../utils/http-request"
import { castToObject } from "../../../utils/JSON";
import { testPassword } from "../util/testPassword";
import { alwaysDelay } from "../../../utils/promise"

import { ERRORS } from "../../../constants/errors";

import {
  userAndServSchema, passwordSchema
} from "../schemas";

import {
  useridToJwt
} from "../util/userid-to-jwt"

const ERROR_CONTEXT: ErrorContext = {
  location: "server",
  file: __filename,
  function: "the file",
}

export const login: NextHandleFunction = async (req, res, next)=>{
  alwaysDelay(
    3 * 1000,
    async ()=>{
      const json = castToObject(await jsonBody(req), ERRORS.BAD_FORM);
      const {
        user
      } = await testPassword(json.email, json.password);
      const [signedToken, protectedInfo] = await Promise.all([
        useridToJwt(user.id),
        userAndServSchema.get(user.id)
      ]);
      return { signedToken, protectedInfo };
    },
    ({ signedToken, protectedInfo })=>{
      res.statusCode = 200;
      res.end({
        status: "ok",
        token: signedToken,
        info: protectedInfo
      });
    },
    (e)=>{
      next(e);
    }
  );
}
