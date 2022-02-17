
import Router from "router";
import { Server } from 'http';
import { ERRORS } from "./constants/errors";
import { notifyOfInternalError } from "./global-vars/team-notifications"

import { router as paymentRouter } from "./ux/payment";
import { router as userRouter } from "./ux/user";

const router = Router()

// https://github.com/microsoft/TypeScript/issues/9458
router.get('/', function (_, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end({
    "hello": "world",
    "whoami": "an api server!",
    "server": process.env.HELLO_WORLD
  })
})

router.use("/user", userRouter)
router.use("/payment", paymentRouter);

const server = new Server();

server.on("request", function(req, res){
  const oldResEnd = res.end.bind(res);
  res.end = function(v: unknown){
    if(typeof v === "object"){
      res.setHeader("content-type", "application/json");
      v = JSON.stringify(v);
    }
    return oldResEnd(v);
  }
  console.log("recieved request");
  console.log("url:", req.url);
  console.log("headers:", req.headers);
  // https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
  // issue is that it seems docker always returns a docker address
  console.log("remote address:", req.socket.remoteAddress);
  router(req, res, (e)=>{
    console.error("server error:", e);
    if(!e) e = ERRORS.NOT_FOUND;
    var status = e.status || e.statusCode;
    if(!status){
      status = ERRORS.SERVER_ERROR.status;
    }
    var message = e.message || e.statusMessage;
    if(!message){
      message = "Unknown error"
    }
    if(status >= 500){
      if(typeof e.internal === "object" && !Array.isArray(e.internal)){
        notifyOfInternalError(
          e.internal.context, e.internal.args, e.internal.err
        );
      } else {
        notifyOfInternalError(
          {
            location: "server",
            file: "unknown",
            function: "router final handler"
          }, [], e
        );
      }
    }
    res.statusCode = status;
    return res.end({
      status: "error",
      message: message
    })
  });
})

const PORT = process.env.HTTP_PORT || 80;
server.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`);
})
