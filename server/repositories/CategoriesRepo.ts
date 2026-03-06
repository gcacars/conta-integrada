import type { Document } from "mongodb";

export const categorySchema = {
  "title": "TransactionCategory",
  "bsonType": "object",
  "properties": {
    "_id": {
      "bsonType": "objectId",
      "description": "Category ID"
    },
    "name": {
      "bsonType": "binData",
      "description": "Category's name",
    },
    "active": {
      "bsonType": "bool",
      "description": "`true` is this category is active"
    },
    "color": {
      "bsonType": ["string", "null"],
      "description": "Category's color"
    },
    "parentId": {
      "bsonType": ["objectId", "null"],
      "description": "Group ID"
    },
    "kind": {
      "bsonType": "string",
      "enum": ["INVESTMENT", "EXPENSE", "INCOME", "TRANSFER", "DIVIDEND", "INTEREST", "TAX", "REFUND", "ADJUSTMENT", "CONTRIBUTION", "REDEMPTION"],
      "description": "TransactionType"
    },
    "userId": {
      "bsonType": "objectId",
      "description": "Owner ID"
    }
  },
  "required": [
    "_id",
    "name",
    "active",
    "kind",
    "userId"
  ],
  "additionalProperties": true,
} as Document;
