
import { MAX_SAFE_NUMBER } from "../constants";
const MAX_SAFE_STR = MAX_SAFE_NUMBER.toString(32);
var counter = 0;
export function uniqueId(){
  const c = counter;
  counter = (counter + 1)%MAX_SAFE_NUMBER;
  return ([
    padString(c.toString(32), MAX_SAFE_STR.length),
    padString(Date.now().toString(32), MAX_SAFE_STR.length),
    padString(Math.random().toString(32).substring(2), MAX_SAFE_STR.length),
  ]).join("-");
}


export function padString(str: string, expectedLength: number){
  if(str.length > expectedLength){
    return str.slice(0, expectedLength);
  }
  if(str.length === expectedLength) return str;
  return "0".repeat(expectedLength - str.length).concat(str);
}

export function randomNumbers(length: number, base: number = 10){
  var ret = "";
  // since we are flooring we will never reach 256 only 0 to 255
  // as a result, to be inclusive to 255, we need to add 1 to the
  const maxNum = findMaxSingleDigit(base) + 1;
  do{
    ret += Math.floor(maxNum * Math.random()).toString(base);
  }while(ret.length < length);

  return ret.substring(0, length);
}

function findMaxSingleDigit(base: number){
  var i = 0;
  do{
    i++;
  }while((i + 1).toString(base).length < 2);
  return i;
}
