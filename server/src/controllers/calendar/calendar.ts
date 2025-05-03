import path from 'node:path';
import fs from 'node:fs';
import * as url from 'node:url';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import type { Request, Response } from 'express';
import calendars from '../../calendar-ids.json' with { type: 'json' };
import { __DIRNAME } from '../../constants.ts';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const auth = new GoogleAuth({
    keyFile: path.join(__DIRNAME, 'calendar-gcloud-service-account.json'),
    scopes: SCOPES,
});

const calendar = google.calendar({
    version: 'v3',
    auth,
});

export async function getCalendarEvents(req: Request, res: Response) {
    const now = new Date();
    const todayStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const from = req.query.from?.toString() ?? todayStartTime.toISOString();
    const to = req.query.to?.toString() ?? tomorrowStartTime.toISOString();

    if (process.env.NODE_ENV === 'development') {
        const responseFilePath = path.join(url.fileURLToPath(new URL('.', import.meta.url)), 'response.json');
        res.status(200).send(fs.readFileSync(responseFilePath));
        return;
    }

    const eventsRequests = [];
    for (const calendarId of calendars) {
        eventsRequests.push(calendar.events.list({
            calendarId,
            timeMin: from,
            timeMax: to,
        }));
    }
    const calendarResponses = await Promise.all(eventsRequests);

    const eventTags = new Set();
    const uniqueEvents = [];

    for (const response of calendarResponses) {
        const events = response.data.items;
        if (!events) {
            continue;
        }

        for (const event of events) {
            if (eventTags.has(event.etag)) {
                continue;
            }
            eventTags.add(event.etag);
            uniqueEvents.push(event);
        }
    }

    res.status(200).send(uniqueEvents);
}