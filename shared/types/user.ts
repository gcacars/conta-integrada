import type { ObjectId } from "mongodb";
import type { AuditableRecord } from "./base";

export interface User extends AuditableRecord {
  _id: string;
  email: string;
  name: string;
}

export interface DocumentOwner {
  userId: ObjectId;
}
