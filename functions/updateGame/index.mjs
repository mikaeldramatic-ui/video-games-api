import middy from "@middy/core";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../services/db.mjs";
import { sendResponse } from "../../responses/index.mjs";

const textFields = ['title','developer','platform','genre',];
const numberFields = ['year','rating'];

const updateGame = async (event) => {
    const id = event.pathParameters.id;
    const body = event.body;

    if (!body) {
        throw createError(400,'Request body is required.');
    }

    const invalidText = textFields.filter((field) => typeof body [field] !== 'string');
    const invalidNumbers = numberFields.filter((field) => typeof body[field] !== 'number');

    if (invalidText.length > 0 || invalidNumbers.length > 0) {
        const invalidFields = [...invalidText, ...invalidNumbers];
        throw createError(400, `Missing or invalid fields: ${invalidFields.join(', ')}`);
    }

    if (body.rating < 1 || body.rating >10) {
        throw createError(400, 'Rating must be between 1 and 10');
    }
    
    try {
        const { Attributes } = await db.send(new UpdateCommand({
            TableName: 'video-games-db',
            Key: { id: id },
            UpdateExpression: 'SET #title = :title, #developer = :developer, #platform = :platform, #genre = :genre, #year = :year, #rating = :rating',
            ExpressionAttributeNames: {
                '#title': 'title',
                '#developer': 'developer',
                '#platform': 'platform',
                '#genre': 'genre',
                '#year': 'year',
                '#rating': 'rating'
            },
            ExpressionAttributeValues: {
                ':title': body.title,
                ':developer': body.developer,
                ':platform': body.platform,
                ':genre': body.genre,
                ':year': body.year,
                ':rating': body.rating
            },
            ConditionExpression: 'attribute_exists(id)',
            ReturnValues: 'ALL_NEW'
        }));

        return sendResponse(200, Attributes);
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(404, 'Game not found.');
        }
        throw error;
    }
};

export const handler = middy(updateGame)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler());