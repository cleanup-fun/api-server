import { JSON_Unknown, JSON_Object, JSON_Array } from "../types/JSON";

export function castToObject(un: JSON_Unknown, e?: any): JSON_Object{
  if(typeof un !== "object"){
    throw (e || new Error("Json is not an object"))
  }
  if(un === null){
    throw (e || new Error("Json is null"))
  }
  if(Array.isArray(un)){
    throw (e || new Error("Json is an array"))
  }

  return un;
}

export function castToArray(un: JSON_Unknown, e?: any): JSON_Array{
  if(typeof un !== "object"){
    throw (e || new Error("Json is not an object"))
  }
  if(un === null){
    throw (e || new Error("Json is null"))
  }
  if(!Array.isArray(un)){
    throw (e || new Error("Json is not an array"))
  }

  return un;
}
