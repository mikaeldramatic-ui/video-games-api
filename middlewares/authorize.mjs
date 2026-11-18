import { createError } from "@middy/util";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../services/db.mjs";

export const authorize = () => ({
    before: async (request) => {
        const id = request.event.pathParameters.id;
        const userId = request.event.user.userId;

        const { Item: game } = await db.send(new GetCommand ({
            TableName: 'video-games-db',
            Key: { id: id }    
        }));

        if (!game) {
            throw createError(404, 'Game not found.');
        }

        if (game.userId !== userId) {
            throw createError(403, 'You are not allowed to delete this game.');
        }
    }
})