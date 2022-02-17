
import Router from "router";

import { userProtected } from "../../user";

import { iaphubWebhook } from "./iaphub-webhook";
import { paymentStatus } from "./payment-status";

export const router = new Router();
// Do we give this a unique name to avoid people finding out?
router.post("/iaphub-webhook", iaphubWebhook)
router.get("/status", userProtected, paymentStatus);
