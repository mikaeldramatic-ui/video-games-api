import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";

export const handler = async (event) => {
  const franchiseId = event.pathParameters.franchiseId;

  const { Item } = await db.send(
    new GetCommand({
      TableName: "game-franchises-db",
      Key: {
        PK: `FRANCHISE:${franchiseId}`,
        SK: `FRANCHISE:${franchiseId}`,
      },
    }),
  );

  if (!Item) {
    return sendResponse(404, { message: "Franchise not found." });
  }

  return sendResponse(200, Item);
};
