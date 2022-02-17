

export function delay(time: number){
  return new Promise((res)=>(setTimeout(res, time)));
}

export async function loopUntilLimit<T>(limit: number, fn: ()=>T, e?: any): Promise<T>{
  for(var i = 0; i < limit; i++){
    const result = await fn();
    if(typeof result !== "undefined") return result;
    await delay(250);
  }
  throw (e || new Error("timeout"));
}


export async function alwaysDelay<T, R>(time: number, toRun: ()=>Promise<T>, end:(v:T)=>R, next: (e: any)=>void){
  const start = Date.now();
  var result;
  try {
    result = await toRun();
  }catch(e){
    await delay(Math.max(time - (Date.now() - start), 0));
    return next(e);
  }
  await delay(Math.max(time - (Date.now() - start), 0));
  return end(result);
}
