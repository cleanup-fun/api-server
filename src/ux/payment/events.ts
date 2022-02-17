import { EventEmitter } from "events";
import { PublicType, events as userEvents, userAndServSchema } from "../user";
import { loopUntilLimit } from "../../utils/promise";
import { NO_REPLY_EMAIL } from "../../constants/email";
import { mailer } from "../../global-vars/mailer"

import { createPaymentStatusByUserId } from "./util/find-or-create-payment-status";

export const events = new EventEmitter();

events.on("purchase", async (userId, status, info)=>{
  const user = await userAndServSchema.get(userId);
  const email = user ? user.email : "no email found";
  return mailer.sendMail({
    from: NO_REPLY_EMAIL,
    to: "payments@cleanupfun.app",
    subject: "we have a purchase!: " + email,
    text: [
      "Email: " + email,
      "Status:\n" + Object.keys(status).map((key)=>{
        return key + ": " + status[key]
      }).join("\n"),
      "Info:\n" + Object.keys(info).map((key)=>{
        return key + ": " + info[key]
      }).join("\n")
    ].join("\n\n==================\n\n")
  })
})

events.on("refund", async (userId, status, info)=>{
  const user = await userAndServSchema.get(userId);
  const email = user ? user.email : "no email found";
  return mailer.sendMail({
    from: NO_REPLY_EMAIL,
    to: "payments@cleanupfun.app",
    subject: "we have a refund...: " + email,
    text: [
      "Email: " + email,
      "Status:\n" + Object.keys(status).map((key)=>{
        return key + ": " + status[key]
      }).join("\n"),
      "Info:\n" + Object.keys(info).map((key)=>{
        return key + ": " + info[key]
      }).join("\n")
    ].join("\n\n==================\n\n")
  })
})


import { DataDocument } from "../../global-vars/database";
userEvents.on("new user", async (user: DataDocument<PublicType>)=>{
  // const sharedUser = await loopUntilLimit(8,
  //   ()=>(userAndServSchema.get(user.id))
  // );
  // if(typeof sharedUser === "undefined"){
  //   throw new Error("new user just created and we can't find it");
  // }
  // await createPaymentStatusByUserId(user.id, sharedUser);
})
