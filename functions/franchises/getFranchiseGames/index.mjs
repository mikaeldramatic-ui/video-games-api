import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";

export const handler = async (event) => {
  const franchiseId = event.pathParameters.franchiseId;

  const { Items } = await db.send(
    new QueryCommand({
      TableName: "game-franchises-db",
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": `FRANCHISE:${franchiseId}`,
        ":prefix": "GAME:",
      },
    }),
  );

  return sendResponse(200, Items);
};
