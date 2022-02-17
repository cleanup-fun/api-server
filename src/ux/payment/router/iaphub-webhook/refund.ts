import { JSON_Object } from "../../../../types/JSON";
import { getTime } from "../../../../utils/time";

import { ERRORS } from "../../../../constants/errors";

import {
  paymentStatusSchema, refundInfoSchema, RefundInfoType
} from "../../schemas";
import {
  findOrCreatePaymentStatusByIaphubId
} from "../../util/find-or-create-payment-status";

import { events as paymentEvents } from "../../events";

export const refund = async (data: JSON_Object)=>{
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

  const info = castToRefundInfo(data);
  const netTime = product.time * info.quantity;
  const oldBalance = status.timeBalance - (now - status.startDate)
  const timeBalance = (
    // If they still have time left, we want them to be able to use it
    oldBalance > 0 ? oldBalance :
    // if they were in good standing, we want them to have a clean slate
    status.timeBalance > 0 ? 0 :
    // otherwise just pile on the debt
    status.timeBalance
  ) - netTime;

  const [newStatus] = await Promise.all([
    paymentStatusSchema.patch(status.id, {
      status: timeBalance < 0 ? "bad" : "ok",
      startDate: now,
      timeBalance: timeBalance
    }),
    refundInfoSchema.add(info)
  ])
  paymentEvents.emit("purchase", data.userId, newStatus, info);
}

function castToRefundInfo(json: JSON_Object): RefundInfoType{
  if(typeof json.id !== "string") throw ERRORS.BAD_FORM
  if(typeof json.purchaseDate !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.quantity !== "number") throw ERRORS.BAD_FORM;
  if(typeof json.platform !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.country !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.orderId !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.app !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.user !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.userId !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.product !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.listing !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.store !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.currency !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.price !== "number") throw ERRORS.BAD_FORM;
  if(typeof json.convertedCurrency !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.convertedPrice !== "number") throw ERRORS.BAD_FORM;
  if(typeof json.isSandbox !== "boolean") throw ERRORS.BAD_FORM;
  if(typeof json.isRefunded !== "boolean") throw ERRORS.BAD_FORM;
  if(typeof json.refundDate !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.refundReason !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.isSubscription !== "boolean") throw ERRORS.BAD_FORM;
  if(typeof json.productSku !== "string") throw ERRORS.BAD_FORM;
  if(typeof json.productType !== "string") throw ERRORS.BAD_FORM;

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
    orderId: json.orderId,
    app: json.app,
    user: json.user,
    userId: json.userId,
    product: json.product,
    listing: json.listing,
    store: json.store,
    currency: json.currency,
    price: json.price,
    convertedCurrency: json.convertedCurrency,
    convertedPrice: json.convertedPrice,
    isSandbox: json.isSandbox,
    isRefunded: json.isRefunded,
    refundDate: json.refundDate,
    refundReason: json.refundReason,
    isSubscription: json.isSubscription,
    productSku: json.productSku,
    productType: json.productType,
  };
}

async function getProductById(id: string){
  return {
    price: 0.00,
    time: 1000 * 60 * 60 * 24 * 30
  }
}
