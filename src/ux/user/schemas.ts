import { DataSchema } from "../../global-vars/database";

export type PublicType = {
  name: string,
  roles: Array<string>,
}

export const publicSchema = new DataSchema<PublicType>("user-public");

export type UserAndServerType = {
  userId: string,
  email: string,
  iaphubId: string,
  deleteKey: string
}

export const userAndServSchema = new DataSchema<UserAndServerType>("user-shared");

export type JWTType = {
  jwtId: string,
  userId: string,
}

export const jwtSchema = new DataSchema<JWTType>("user-private");

export type PasswordCodeType = {
  userId: string,
  code: string,
}

export const codeSchema = new DataSchema<PasswordCodeType>("code");

export type PasswordType = {
  userId: string,
  hash: string,
  email: string,
}

export const passwordSchema = new DataSchema<PasswordType>("password");
