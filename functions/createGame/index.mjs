import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../services/db.mjs';
import { sendResponse } from '../../responses/index.mjs';
import { authenticate } from '../../middlewares/authenticate.mjs';
import { validate } from '../../middlewares/validate.mjs';
import { createGameSchema } from '../../schemas/games.mjs';

const createGame = async (event) => {
    const body= event.body;

    const newId = crypto.randomUUID();

    const newGame = {
        id: newId,
        title: body.title,
        developer: body.developer,
        platform: body.platform,
        genre: body.genre,
        year: body.year,
        rating: body.rating,
        userId: event.user.userId
    };

    await db.send(new PutCommand({
        TableName: 'video-games-db',
        Item: newGame
    }));

    return sendResponse(201, newGame);
};

export const handler = middy(createGame)
    .use(authenticate())
    .use(httpJsonBodyParser())
    .use(validate(createGameSchema))
    .use(httpErrorHandler());