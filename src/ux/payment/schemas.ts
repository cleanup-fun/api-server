import { DataSchema } from "../../global-vars/database";

export type PaymentStatusType = {
  iaphubId: string,
  userId: string,
  status: "bad" | "new" | "ok",
  startDate: number,
  timeBalance: number,
  sandbox: boolean,
}
export const paymentStatusSchema = new DataSchema<PaymentStatusType>("payment-status");

// There may be an opportunity to track when an average person has paid
// And then create deals on those days to attract buyers
// I don't want to be a slime ball though
// Granted I do want to make a lot of money
// I think saving the information anonymously instead of targeting individuals
// Is probably a better overall idea
// This way I can still make informed decisions
// but I'm not invading a persons privacy
// I should let the user know I keep track of all payments but I don't tie it to them
// If they would like to know when they have made payments to use, they should check their bank
export type PurchaseInfoType = {
  timestamp: number,
  purchaseId: string,

  // Below is data iaphub sends me
  purchaseDate: string,
  quantity: number,
  platform: string,
  country: string,
  app: string,
  product: string,
  productSku: string,
  productType: string,
  listing: string,
  store: string,
  currency: string,
  price: number,
  convertedCurrency: string,
  convertedPrice: number,
  isSandbox: boolean,
  isRefunded: boolean,
  isSubscription: boolean
}
export const purchaseInfoSchema = new DataSchema<PurchaseInfoType>("purchase-info");

export type RefundInfoType = {
  timestamp: number,
  purchaseId: string,

  purchaseDate: string,
  quantity: number,
  platform: string,
  country: string,
  orderId: string,
  app: string,
  user: string,
  userId: string,
  product: string,
  listing: string,
  store: string,
  currency: string,
  price: number,
  convertedCurrency: string,
  convertedPrice: number,
  isSandbox: boolean,
  isRefunded: boolean,
  refundDate: string,
  refundReason: string,
  isSubscription: boolean,
  productSku: string,
  productType: string
}
export const refundInfoSchema = new DataSchema<RefundInfoType>("refund-info");
