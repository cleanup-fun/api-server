import { isGoodPassword } from "../../../validators/user";
import {
  ErrorContext,
} from "../../../global-vars/team-notifications"
import bcrypt from "bcryptjs";

const ERROR_CONTEXT: ErrorContext = {
  location: "server",
  file: __filename,
  function: "the file",
}

import { ERRORS } from "../../../constants/errors";
import { ERRORS as USER_ERRORS } from "../errors";

import { JSON_Object } from "../../../types/JSON";

// We do this in a seperate function so that if we change something
// We don't have to change it twice
export async function prepNewPassword(json: JSON_Object): Promise<string>{
  const {
    password, repeatedPassword
  } = json;
  if(typeof password !== "string"){
    throw ERRORS.BAD_FORM;
  }
  try {
    isGoodPassword(password)
  }catch(e){
    console.error("we have a weak password:", e);
    throw USER_ERRORS.WEAK_PASSWORD;
  }
  if(password !== repeatedPassword){
    throw USER_ERRORS.UNEQUAL_PASSWORD
  }

  const salt: string = await bcrypt.genSalt(10).catch((err)=>{
    throw {
      ...ERRORS.SERVER_ERROR,
      internal: {
        context: {
          ...ERROR_CONTEXT,
          function: "bcrypt.genSalt"
        },
        args: [10],
        err: err
      }
    }
  });
  return await bcrypt.hash(password, salt).catch((err)=>{
    throw {
      ...ERRORS.SERVER_ERROR,
      internal: {
        context: {
          ...ERROR_CONTEXT,
          function: "bcrypt.hash"
        },
        args: ["hidden password", salt],
        err: err
      }
    }
  });
}
