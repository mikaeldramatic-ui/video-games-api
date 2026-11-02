import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../services/db.mjs';
import { sendResponse } from '../../responses/index.mjs';

export const handler = async (event) => {
    const id = event.pathParameters.id;

    const { Item } = await db.send(new GetCommand({
        TableName: 'video-games-db',
        Key: { id: id }
    }));

    if (!Item) {
        return sendResponse(404, { message: 'Game not found.' });
    }

    return sendResponse(200, Item);
};