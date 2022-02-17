
import { IncomingMessage } from "http";
import { Socket } from "net";

type MaybeEncryptedSocket = Socket & { encrypted?: true };

export function getProtocol(req: IncomingMessage){
    const proto = (req.socket as MaybeEncryptedSocket).encrypted ? 'https' : 'http';
    var protoHeaders = req.headers['x-forwarded-proto'];
    if(!protoHeaders){
      return proto;
    }
    if(!Array.isArray(protoHeaders)){
      protoHeaders = protoHeaders.split(/\s*,\s*/)
    }
    return protoHeaders[0];
}

import jsonBodyCallback from "body/json";
import { JSON_Unknown } from "../types/JSON";

export function jsonBody(req: IncomingMessage): Promise<JSON_Unknown>{
  return new Promise((res, rej)=>{
    jsonBodyCallback(req, (err, json)=>{
      if(err) return rej(err);
      res(json as JSON_Unknown)
    })
  })
}
