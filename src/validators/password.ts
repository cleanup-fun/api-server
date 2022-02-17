
const ERRORS = {
  TOO_SMALL: "password needs to be longer",
  NEED_LOWER: "need at least 1 lowercase letter",
  NEED_UPPER: "need at least 1 uppercase letter",
  NEED_NUM: "need at least 1 number",
  NEED_SYMBOL: "need at least 1 non letter non number symbol",
}

const lowerCaseTest = /[a-z]/;
const upperCaseTest = /[A-Z]/;
const numberTest = /[0-9]/;
const symbolTest = /[ ~`!@#$%^&*()_\-+={}\[\]|\:;"'<,>.\?\/]/
const minLength = 8;

export function isGoodPassword(password: string){
  if(password.length < minLength) throw new Error(ERRORS.TOO_SMALL);
  if(!lowerCaseTest.test(password)) throw new Error(ERRORS.NEED_LOWER);
  if(!upperCaseTest.test(password)) throw new Error(ERRORS.NEED_UPPER);
  if(!numberTest.test(password)) throw new Error(ERRORS.NEED_NUM);
  if(!symbolTest.test(password)) throw new Error(ERRORS.NEED_SYMBOL);
}
