import { NextHandleFunction } from "connect";
import { jsonBody } from "../../../../utils/http-request"
import { castToObject } from "../../../../utils/JSON";

import {
  IAPHUB_WEBHOOK_AUTH_TOKEN,
  IAPHUB_AUTH_HEADER
} from "../../../../constants";

import { ERRORS } from "../../../../constants/errors";

import { purchase } from "./purchase";
import { refund } from "./refund";

export const iaphubWebhook: NextHandleFunction = async (req, res, next)=>{
  try {
    const authtoken = req.headers[IAPHUB_AUTH_HEADER];
    if(authtoken !== IAPHUB_WEBHOOK_AUTH_TOKEN){
      throw ERRORS.FORBIDDEN;
    }
    const json = castToObject(await jsonBody(req), ERRORS.BAD_FORM);
    if(typeof json.type !== "string") throw ERRORS.BAD_FORM;
    const data = json.data;
    if(typeof data !== "object") throw ERRORS.BAD_FORM;
    if(Array.isArray(data)) throw ERRORS.BAD_FORM;
    switch(json.type){
      case "test": break;
      case "purchase": {
        await purchase(data);
      }
      case "refund": {
        await refund(data);
      }
      case "user_id_update": {
        // since these are consumables
        // They probably cannot be transfered
      }
      default: {
        console.error("iaphub sent us a bad product:", json);
        throw ERRORS.BAD_FORM
      }

    }

    console.log("json:", json);
    res.statusCode = 200;
    res.end();
  }catch(e){
    next(e);
  }
};
