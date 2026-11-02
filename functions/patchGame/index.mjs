import middy from "@middy/core";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from "@middy/http-error-handler";
import { createError } from "@middy/util";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../services/db.mjs";
import { sendResponse } from "../../responses/index.mjs";

const textFields = ['title', 'developer', 'platform', 'genre',];
const numberFields = ['year', 'rating'];
const allowedFields = [...textFields, ...numberFields];

const patchGame = async (event) => {
    const id = event.pathParameters.id;
    const body = event.body;

    if (!body || Object.keys(body).length === 0) {
        throw createError(400, 'At least one field is required.');
    }

    const fields = Object.keys(body);

    const unknownFields = fields.filter((field) => !allowedFields.includes(field));
    if (unknownFields.length > 0) {
        throw createError(400, `Unknown fields: ${unknownFields.join(', ')}`);
    }

    const invalidFields = fields.filter((field) =>
        textFields.includes(field)
            ? typeof body[field] !== 'string'
            : typeof body[field] !== 'number'
    );
    if (invalidFields.length > 0) {
        throw createError(400, `Invalid fields: ${invalidFields.join(', ')}`);
    }

    if (body.rating !== undefined && (body.rating < 1 || body.rating > 10)) {
        throw createError(400, 'Rating must be between 1 and 10');
    }

    const updateExpression = 'SET ' + fields.map((field) => `#${field} = :${field}`).join(', ');

    const names = {};
    const values = {};
    fields.forEach((field) => {
        names[`#${field}`] = field;
        values[`:${field}`] = body[field];
    });

    try {
        const { Attributes } = await db.send(new UpdateCommand({
            TableName: 'video-games-db',
            Key: { id: id },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values,
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

export const handler = middy(patchGame)
    .use(httpJsonBodyParser())
    .use(httpErrorHandler());