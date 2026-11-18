import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";

const textFields = ["gameId", "title", "platform", "genre"];
const numberFields = ["year", "rating"];

const createFranchiseGame = async (event) => {
  const franchiseId = event.pathParameters.franchiseId;
  const body = event.body;

  if (!body) {
    throw createError(400, "Request body is required.");
  }

  const invalidText = textFields.filter(
    (field) => typeof body[field] !== "string",
  );
  const invalidNumbers = numberFields.filter(
    (field) => typeof body[field] !== "number",
  );

  if (invalidText.length > 0 || invalidNumbers.length > 0) {
    const invalidFields = [...invalidText, ...invalidNumbers];
    throw createError(
      400,
      `Missing or invalid fields: ${invalidFields.join(", ")}.`,
    );
  }

  if (!/^[a-z0-9-]+$/.test(body.gameId)) {
    throw createError(
      400,
      "gameId may only contain lowercase letters, numbers and hyphens.",
    );
  }

  if (body.rating < 1 || body.rating > 10) {
    throw createError(400, "Rating must be between 1 and 10.");
  }

  const newGame = {
    PK: `FRANCHISE:${franchiseId}`,
    SK: `GAME:${body.gameId}`,
    type: "game",
    title: body.title,
    platform: body.platform,
    genre: body.genre,
    year: body.year,
    rating: body.rating,
  };

  try {
    await db.send(
      new PutCommand({
        TableName: "game-franchises-db",
        Item: newGame,
        ConditionExpression: "attribute_not_exists(SK)",
      }),
    );
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(
        409,
        "Game with this ID already exists in the franchise.",
      );
    }
    throw error;
  }

  return sendResponse(201, newGame);
};

export const handler = middy(createFranchiseGame)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());
