import { ErrorContext } from "../../../global-vars/team-notifications"
import { signValue } from "../../../global-vars/jwt";

import { ERRORS } from "../../../constants/errors";

import { jwtSchema } from "../schemas";

const ERROR_CONTEXT: ErrorContext = {
  location: "server",
  file: __filename,
  function: "the file",
}

export async function useridToJwt(userId: string){
  const jwtId = await jwtSchema.getByKey("userId", userId);
  if(!jwtId){
    throw {
      ...ERRORS.SERVER_ERROR,
      internal: {
        context: {
          ...ERROR_CONTEXT,
          function: "jwtIdSchema.getByKey"
        },
        arg: [userId],
        err: new Error("user exists but their jwt id doesn't")
      }
    }
  }
  return signValue({ id: jwtId.id }).catch((err)=>{
    throw {
      ...ERRORS.SERVER_ERROR,
      internal: {
        context: {
          ...ERROR_CONTEXT,
          function: "jwt.sign"
        },
        arg: ["hidden id", "secret"],
        err: err
      }
    };
  })
}
