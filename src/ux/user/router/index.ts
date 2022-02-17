import Router from "router";

import {
  getUsers, getUser, getSelf
} from "./get-user";


import { registerOrForgot } from "./register-or-forgot";
import { resetPassword } from "./reset-password";
import { login } from "./login";
import { refreshToken } from "./refresh-token";
import { changePassword } from "./change-password";''
import { changeName } from "./change-name";''
import { addRoll } from "./add-roll"
import { removeRoll } from "./remove-roll"
import { userProtected } from "../middleware/userProtected";
import { roleProtected } from "../middleware/roleProtected";


export const router = new Router();
router.get("/", userProtected, getUsers)
router.get("/self", userProtected, getSelf)
router.get("/refresh-token", userProtected, refreshToken);
router.get("/:userId", userProtected, getUser)
router.post("/register-or-forgot", registerOrForgot);
router.post("/reset-password", resetPassword);
router.post("/login", login)
router.post("/change-password", userProtected, changePassword)
router.post("/change-name", userProtected, changeName);
router.post("/add-roll", userProtected, roleProtected("admin"), addRoll)
router.post("/remove-roll", userProtected, roleProtected("admin"), removeRoll)

/*
I want to give the option to allow people to delete themselves
But perhaps i'll leave this for another day
router.delete("/delete-self", userProtected, (reqUncasted, res, next)=>{
  const req = reqUncasted as ReqWithUser;
  userEvents.emit("user deleted", req.user)
})
*/
