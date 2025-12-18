import path from 'node:path';
import fs from 'node:fs';
import * as url from 'node:url';
import { google, calendar_v3 } from 'googleapis';
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

    if (process.env.NODE_ENV === 'development-sandbox') {
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
    const calendarResults = await Promise.allSettled(eventsRequests);

    // Log any failed calendar requests
    calendarResults.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error('Failed to fetch events from calendar:', calendars[index]);
        }
    });

    const calendarResponses = calendarResults
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

    const eventTags = new Set();
    const canceledEvents = new Set();
    const uniqueEvents = [];

    for (const response of calendarResponses) {
        const events = response.data.items?.toSorted((a, b) => {
            if (isCancelled(a) && !isCancelled(b)) {
                return -1;
            } else if (!isCancelled(a) && isCancelled(b)) {
                return 1;
            }

            return 0;
        });
        if (!events) {
            continue;
        }

        for (const event of events) {
            // Skip cancelled events (e.g., deleted instances of recurring events)
            if (isCancelled(event) || canceledEvents.has(event.etag)) {
                canceledEvents.add(event.etag);
                continue;
            }

            if (eventTags.has(event.etag)) {
                continue;
            }
            eventTags.add(event.etag);
            uniqueEvents.push(event);
        }
    }

    res.status(200).send(uniqueEvents);
}

function isCancelled(event: calendar_v3.Schema$Event) {
    return event.status === 'cancelled';
}