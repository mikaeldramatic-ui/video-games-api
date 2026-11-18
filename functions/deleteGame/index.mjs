import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import { createError } from '@middy/util';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../services/db.mjs";
import { sendResponse } from "../../responses/index.mjs";
import { authenticate } from '../../middlewares/authenticate.mjs';
import { authorize } from '../../middlewares/authorize.mjs';

const deleteGame = async (event) => {
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
            throw createError(404,'Game not found.');
        }
        throw error;
    }

};

export const handler = middy(deleteGame)
    .use(authenticate())
    .use(authorize())
    .use(httpErrorHandler());
