import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../services/db.mjs';
import { sendResponse } from '../../responses/index.mjs';

export const handler = async (event) => {
    const query = event.queryStringParameters || {};

    const { Items } = await db.send(new ScanCommand({
        TableName: 'video-games-db'
    }));

    let result = Items;

    if (query.platform) {
        const platform = query.platform.toLowerCase();
        result = result.filter((item) => item.platform.toLowerCase().includes(platform));
    }

    if (query.genre) {
        const genre = query.genre.toLowerCase();
        result = result.filter((item) => item.genre.toLowerCase().includes(genre));
    }


    return sendResponse(200, result);
};