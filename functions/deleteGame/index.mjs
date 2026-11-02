import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../services/db.mjs";
import { sendResponse } from "../../responses/index.mjs";

export const handler = async (event) => {
    const id = event.pathParameters.id;

    try {
        const { Attributes } = await db.send(new DeleteCommand({
            TableName: 'video-games-db',
            Key: { id: id },
            ConditionExpression: 'attribute_exists(id)',
            ReturnValues: 'ALL_OLD'
        }));

        return sendResponse(200, { message: 'Game deleted.', game: Attributes });
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            return sendResponse(404, { message: 'Game not found.' });
        }
        throw error;
    }

};
