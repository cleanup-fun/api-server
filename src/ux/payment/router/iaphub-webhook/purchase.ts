import { JSON_Object } from "../../../../types/JSON";
import { getTime } from "../../../../utils/time";

import { ERRORS } from "../../../../constants/errors";

import {
  paymentStatusSchema, purchaseInfoSchema, PurchaseInfoType
} from "../../schemas";
import {
  findOrCreatePaymentStatusByIaphubId
} from "../../util/find-or-create-payment-status";

import { events as paymentEvents } from "../../events";

export const purchase = async (data: JSON_Object)=>{
  if(typeof data.userId !== "string") throw ERRORS.BAD_FORM;
  if(typeof data.productSku !== "string") throw ERRORS.BAD_FORM;
  // https://www.iaphub.com/docs/webhooks/purchase
  const [
    status, product, now
  ] = await Promise.all([
    findOrCreatePaymentStatusByIaphubId(data.userId),
    getProductById(data.productSku),
    getTime()
  ])
  if(!status) throw ERRORS.NOT_FOUND
  if(!product) throw ERRORS.NOT_FOUND

  const info = castToPurchaseInfo(data);
  const netTime = product.time * info.quantity;
  const oldBalance = status.timeBalance - (now - status.startDate)
  const balanceSum = status.timeBalance + netTime;

  const [newStatus] = await Promise.all([
    paymentStatusSchema.patch(status.id,

      // If they haven't paid everything back yet, they still need to pay
      balanceSum < 0 ? {
        status: "bad",
        timeBalance: balanceSum,
      } : {
        status: "ok",
        startDate: now,
        timeBalance: (
          // If they paid partly back, they only get the part
          balanceSum < netTime ? balanceSum :
          // if the previous balance ran out, this the beginning
          oldBalance < 0 ? netTime :
          // otherwise we append to the old balance
          oldBalance + netTime
        ),
      }
    ),
    purchaseInfoSchema.add(info)
  ])
  paymentEvents.emit("purchase", data.userId, newStatus, info);
}

function castToPurchaseInfo(json: JSON_Object): PurchaseInfoType{
  if(typeof json.id !== "string") throw ERRORS.BAD_FORM
  if(typeof json.purchaseDate !== "string") throw ERRORS.BAD_FORM
  if(typeof json.quantity !== "number") throw ERRORS.BAD_FORM;
  if(typeof json.platform !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.country !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.app !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.product !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.productSku !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.productType !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.listing !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.store !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.currency !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.price !== "number") throw ERRORS.BAD_FORM;
  if(typeof json.convertedCurrency !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.convertedPrice !== "number") throw ERRORS.BAD_FORM;
  if(typeof json.isSandbox !== "boolean") throw ERRORS.BAD_FORM;
  if(typeof json.isRefunded !== "boolean") throw ERRORS.BAD_FORM;
  if(typeof json.isSubscription !== "boolean") throw ERRORS.BAD_FORM;

  const purchaseId = json.id;
  const timestamp = new Date(json.purchaseDate).valueOf();
  delete json.id;

  return {
    timestamp: timestamp,
    purchaseId: purchaseId,
    purchaseDate: json.purchaseDate,
    quantity: json.quantity,
    platform: json.platform,
    country: json.country,
    app: json.app,
    product: json.product,
    productSku: json.productSku,
    productType: json.productType,
    listing: json.listing,
    store: json.store,
    currency: json.currency,
    price: json.price,
    convertedCurrency: json.convertedCurrency,
    convertedPrice: json.convertedPrice,
    isSandbox: json.isSandbox,
    isRefunded: json.isRefunded,
    isSubscription: json.isSubscription,
  };
}

async function getProductById(id: string){
  return {
    price: 0.00,
    time: 1000 * 60 * 60 * 24 * 30
  }
}
