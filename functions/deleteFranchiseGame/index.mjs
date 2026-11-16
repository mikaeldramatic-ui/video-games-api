import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../services/db.mjs";
import { sendResponse } from "../../responses/index.mjs";

export const handler = async (event) => {
  const { franchiseId, gameId } = event.pathParameters;

  try {
    const { Attributes } = await db.send(
      new DeleteCommand({
        TableName: "game-franchises-db",
        Key: {
          PK: `FRANCHISE:${franchiseId}`,
          SK: `GAME:${gameId}`,
        },
        ConditionExpression: "attribute_exists(SK)",
        ReturnValues: "ALL_OLD",
      }),
    );

    return sendResponse(200, { message: "Game deleted.", game: Attributes });
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return sendResponse(404, { message: "Game not found." });
    }
    throw error;
  }
};
