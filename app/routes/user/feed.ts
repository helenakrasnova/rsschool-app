import { NOT_FOUND, OK } from 'http-status-codes';
import * as Router from 'koa-router';
import { ILogger } from '../../logger';
import { FeedRecordDocument, IApiResponse, IFeedRecord, IUserSession, UserDocument } from '../../models';

export function userFeedRoute(_: ILogger) {
    const router = new Router({ prefix: '/user' });

    router.get('/feed', async ctx => {
        const userSession: IUserSession = ctx.state.user!;
        const user = await UserDocument.findById(userSession._id);
        if (user === null) {
            ctx.status = NOT_FOUND;
            return;
        }
        const feedRecords = await FeedRecordDocument.find({
            userId: user._id,
        })
            .sort({ dateTime: -1 })
            .exec();

        const body: IApiResponse<IFeedRecord[]> = {
            data: feedRecords,
        };

        ctx.body = body;
        ctx.status = OK;
    });

    return router;
}