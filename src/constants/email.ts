import { resolve as pathResolve } from "path";
import { readFileSync } from "fs";

const nmpkFile = pathResolve(process.cwd(), "./nodemailer-privatekey.json");
const key = JSON.parse(readFileSync(nmpkFile, "utf-8"));

const nmEmail = process.env.NODE_MAILER_EMAIL;
if(!nmEmail){
  throw new Error(
    "missing email environment variable file for nodemailer"
  );
}

console.log(nmEmail);
console.log(key.client_email);

export const NO_REPLY_EMAIL = nmEmail;
export const nodemailerConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "samtobia@cleanupfun.app",
    serviceClient: key.client_id,
    privateKey: key.private_key,
  }
};
