import nodemailer, { TransportOptions } from "nodemailer";
import {google} from 'googleapis';
import { nodemailerConfig } from "../constants/email";
export const transport = nodemailer.createTransport(
  nodemailerConfig as TransportOptions
);

type MailBase = {
  from: string,
  sender?: string,
  to: string,
  subject: string,
}

type MailHTML = MailBase & { html: string };
type MailText = MailBase & { text: string };
type Mail = MailHTML | MailText;


export const mailer = {
  sendMail(mail: Mail){
    mail.from = "noreply@cleanupfun.app";
    mail.sender = "noreply@cleanupfun.app"
    return transport.sendMail(mail);
  }
}
