import jwt from "jsonwebtoken";
import { JSON_WEBTOKEN_SECRET, JSON_WEBTOKEN_EXPIRATION } from "../constants/user";
import { JSON_Object } from "../types/JSON"

type TokenAndExp = {
  token: string,
  expiration: number
}

export function signValue(obj: JSON_Object): Promise<TokenAndExp>{
  return new Promise<string>((res, rej)=>{
    jwt.sign(obj, JSON_WEBTOKEN_SECRET, {
      expiresIn: Math.floor(JSON_WEBTOKEN_EXPIRATION/1000)
    }, (err: any, token: string|undefined)=>{
      if(err) return rej(err)
      if(!token) return rej(new Error("JWT returned an empty token and no error"))
      res(token);
    })
  }).then((token)=>{
    return {
      token: token,
      expiration: Date.now() + JSON_WEBTOKEN_EXPIRATION
    }
  })
}

export function verifyToken<T>(token: string): Promise<T>{
  return new Promise((res, rej)=>{
    jwt.verify(token, JSON_WEBTOKEN_SECRET, {}, (err, obj)=>{
      if(err) return rej(err);
      res(obj as T);
    })
  });
}
