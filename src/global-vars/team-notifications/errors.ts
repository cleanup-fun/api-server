import { mailer } from "../mailer"

export type ErrorContext = {
  location: "server" | "client",
  file: string,
  function: string,
}

type IssueError = {
  context: ErrorContext,
  args: Array<any>,
  message: string,
  contents: string,
  stack: string
}

export function notifyOfInternalError(context: ErrorContext, args: Array<any>, e: any){
  const stack = new Error().stack as string;
  console.error("We have an internal error")
  console.error("context:", context);
  console.error("error:", e);
  console.error("stack:", stack)

  const issueError = {
    context, stack,
    args: args,
    message: getErrorMessage(e),
    contents: getErrorContents(e),
  }

  doesIssueExist(issueError).then(async (exists)=>{
    if(exists) return addBadArgsToIssue(issueError)
    Promise.all([
      createIssue(issueError),
      sendIssueEmail(issueError)
    ])
  })
}

async function doesIssueExist(
  { context, args, message, contents, stack}: IssueError
): Promise<false | string>{
  return false
}

async function addBadArgsToIssue(
  { context, args, message, contents, stack}: IssueError
){
  return false
}

async function createIssue(
  { context, args, message, contents, stack}: IssueError
){
  return false
}

function sendIssueEmail(
  { context, args, message, contents, stack}: IssueError
){
  return mailer.sendMail({
    from: "errors@cleanupfun.app",
    to: "errors@cleanupfun.app",
    subject: "new error: " + message,
    text: [
      "Message: " + message,
      "Context:\n" + JSON.stringify(context, null, 2),
      "Args:\n" + formatArgs(args),
      "Contents:\n" + contents,
      "Stack:\n " + stack,
    ].join("\n\n==============================\n\n"),
  })
}

function getErrorMessage(e: any){
  if(typeof e !== "object"){
    return e.toString();
  }
  if(Array.isArray(e)){
    return "Error is an Array"
  }
  if(e instanceof Error){
    return e.message || "anonymous Error"
  }
  return "Error is an object";
}

function getErrorContents(e: any){
  try {
    if(typeof e !== "object"){
      return JSON.stringify(e, null, 2);
    }
    if(Array.isArray(e)){
      return JSON.stringify(e, null, 2);
    }
    if(e instanceof Error){
      return e.stack || "error without stack";
    }
    return JSON.stringify(e, null, 2);
  }catch(e){
    return "Unparsable Error";
  }
}

function formatArgs(args: Array<any>){
  try {
    return JSON.stringify(args, null, 2);
  }catch(e){
    return JSON.stringify(args.map((arg)=>{
      try {
        return JSON.parse(JSON.stringify(arg));
      }catch(e){
        return "unparsable arg"
      }
    }), null, 2);
  }

}
