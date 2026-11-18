import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";

const textFields = ["franchiseId", "name", "developer"];

const createFranchise = async (event) => {
  const body = event.body;

  if (!body) {
    throw createError(400, "Request body is required.");
  }

  const invalidFields = textFields.filter(
    (field) => typeof body[field] !== "string",
  );

  if (invalidFields.length > 0) {
    throw createError(
      400,
      `Missing or invalid fields: ${invalidFields.join(", ")}.`,
    );
  }

  if (!/^[a-z0-9-]+$/.test(body.franchiseId)) {
    throw createError(
      400,
      "franchiseId may only contain lowercase letters, numbers and hyphens.",
    );
  }

  const newFranchise = {
    PK: `FRANCHISE:${body.franchiseId}`,
    SK: `FRANCHISE:${body.franchiseId}`,
    type: "franchise",
    name: body.name,
    developer: body.developer,
  };

  try {
    await db.send(
      new PutCommand({
        TableName: "game-franchises-db",
        Item: newFranchise,
        ConditionExpression: "attribute_not_exists(SK)",
      }),
    );
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(409, "Franchise already exists.");
    }
    throw error;
  }

  return sendResponse(201, newFranchise);
};

export const handler = middy(createFranchise)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());
