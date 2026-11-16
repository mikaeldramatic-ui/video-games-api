import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../services/db.mjs";
import { sendResponse } from "../../responses/index.mjs";

const login = async (event) => {
  const body = event.body;

  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    throw createError(400, "Email and password are required.");
  }

  const { Item: user } = await db.send(
    new GetCommand({
      TableName: "video-games-users",
      Key: { email: body.email },
    }),
  );

  if (!user) {
    throw createError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(
    body.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw createError(401, "Invalid email or password.");
  }

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return sendResponse(200, { token: token });
};

export const handler = middy(login)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());
