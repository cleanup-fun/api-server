import { NO_REPLY_EMAIL } from "../../constants/email";
import { mailer } from "../mailer"

export function notyifyOfNewUser(email: string){
  return mailer.sendMail({
    from: NO_REPLY_EMAIL,
    to: "users@cleanupfun.app",
    subject: "we have a new user!: " + email,
    text: "Maybe we should reach out? Maybe we should just appreciate them"
  })

}
