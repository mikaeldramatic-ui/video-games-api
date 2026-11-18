import jwt from 'jsonwebtoken';
import { createError } from '@middy/util';

export const authenticate = () => ({
    before: (request) => {
        const authHeader = request.event.headers?.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError(401, 'Missing or invalid token.');
        }
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.event.user = decoded;
        } catch (error) {
            throw createError(401, 'Invalid or expired token.');
        }
    }
})