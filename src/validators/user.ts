

const emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
export function testEmail(email: string, e?: any){
  if(!emailRegexp.test(email)){
    throw (e || new Error("Invalid email: " + email));
  }
}

const ERRORS = {
  TOO_SMALL: "needs to be longer",
  TOO_LONG: "needs to be shorter",
  NEED_LOWER: "need at least 1 lowercase letter",
  NEED_UPPER: "need at least 1 uppercase letter",
  NEED_NUM: "need at least 1 number",
  NEED_SYMBOL: "need at least 1 non letter non number symbol",
}

export function isGoodUsername(name: string, e?: any){
  if(name.length < 5) throw (e || new Error(ERRORS.TOO_SMALL));
}

const lowerCaseTest = /[a-z]/;
const upperCaseTest = /[A-Z]/;
const numberTest = /[0-9]/;
const symbolTest = /[ ~`!@#$%^&*()_\-+={}\[\]|\:;"'<,>.\?\/]/
const minLength = 8;

export function isGoodPassword(password: string, e?: any){
  if(password.length < minLength) throw (e || new Error(ERRORS.TOO_SMALL));
  if(!lowerCaseTest.test(password)) throw (e || new Error(ERRORS.NEED_LOWER));
  if(!upperCaseTest.test(password)) throw (e || new Error(ERRORS.NEED_UPPER));
  if(!numberTest.test(password)) throw (e || new Error(ERRORS.NEED_NUM));
  if(!symbolTest.test(password)) throw (e || new Error(ERRORS.NEED_SYMBOL));
}
