
import Router from "router";

import { userProtected } from "../../user";

import { clientError } from "./client-error";
import { supportRequest } from "./support-request";

export const router = new Router();

router.post("/client-error", userProtected, clientError);
router.post("/support-request", userProtected, supportRequest);
