import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { db } from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { validate } from "../../../middlewares/validate.mjs";
import { registerSchema } from "../../../schemas/auth.mjs";

const register = async (event) => {
  const body = event.body;

  const passwordHash = await bcrypt.hash(body.password, 10);

  const newUser = {
    email: body.email,
    userId: crypto.randomUUID(),
    passwordHash: passwordHash,
    createdAt: new Date().toISOString(),
  };

  try {
    await db.send(
      new PutCommand({
        TableName: "video-games-users",
        Item: newUser,
        ConditionExpression: "attribute_not_exists(email)",
      }),
    );
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(409, "Email is already registered.");
    }
    throw error;
  }

  return sendResponse(201, {
    message: "User registered.",
    userId: newUser.userId,
    email: newUser.email,
  });
};

export const handler = middy(register)
  .use(httpJsonBodyParser())
  .use(validate(registerSchema))
  .use(httpErrorHandler());
