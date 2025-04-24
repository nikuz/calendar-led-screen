import path from 'path';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import type { Request, Response } from 'express';
import calendars from '../calendar-ids.json' with { type: 'json' };
import { __DIRNAME } from '../constants.ts';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const auth = new GoogleAuth({
    keyFile: path.join(__DIRNAME, 'calendar-gcloud-service-account.json'),
    scopes: SCOPES,
});

const calendar = google.calendar({
    version: 'v3',
    auth,
});

export async function getCalendarEvents(request: Request, res: Response) {
    const now = new Date();
    const todayStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const from = request.query.from?.toString() ?? todayStartTime.toISOString();
    const to = request.query.to?.toString() ?? tomorrowStartTime.toISOString();

    const eventsRequests = [];

    for (const calendarId of calendars) {
        eventsRequests.push(calendar.events.list({
            calendarId,
            timeMin: from,
            timeMax: to,
        }));
    }

    const eventTags = new Set();
    const uniqueEvents = [];

    const calendarResponses = await Promise.all(eventsRequests);

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