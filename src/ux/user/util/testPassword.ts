import { ErrorContext } from "../../../global-vars/team-notifications"
import { JSON_Unknown } from "../../../types/JSON";
import bcrypt from "bcryptjs";

import { ERRORS } from "../../../constants/errors";
import { ERRORS as USER_ERRORS } from "../errors";

import {
  userAndServSchema, passwordSchema
} from "../schemas";

const ERROR_CONTEXT: ErrorContext = {
  location: "server",
  file: __filename,
  function: "the file",
}

export const testPassword = async (email: void | JSON_Unknown, password: void | JSON_Unknown)=>{
  if(typeof email !== "string") throw ERRORS.BAD_FORM;
  if(typeof password !== "string") throw ERRORS.BAD_FORM;
  const [found, user] = await Promise.all([
    passwordSchema.getByKey("email", email),
    userAndServSchema.getByKey("email", email)
  ]);
  if(!user) throw USER_ERRORS.USER_NOT_FOUND;
  if(!found) throw USER_ERRORS.USER_NOT_FOUND;
  const compared = await bcrypt.compare(password, found.hash).catch((err)=>{
    throw {
      ...ERRORS.SERVER_ERROR,
      internal: {
        context: {
          ...ERROR_CONTEXT,
          function: "bcrypt.compare"
        },
        arg: ["hidden password", "hidden hash"],
        err: err
      }
    }
  });;
  if(!compared) throw USER_ERRORS.USER_NOT_FOUND;
  return {
    email, password, user
  }
};
