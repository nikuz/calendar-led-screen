import path from 'path';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { Request, Response } from 'express';
import { CALENDAR_ID } from '../../calendar-id';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const auth = new GoogleAuth({
    keyFile: path.join(__dirname, '../../calendar-gcloud-service-account.json'),
    scopes: SCOPES,
});

const calendar = google.calendar({
    version: 'v3',
    auth: auth,
});

export async function getCalendarEvents(request: Request, res: Response) {
    const now = new Date();
    const todayStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const from = request.params.from ?? todayStartTime.toISOString();
    const to = request.params.to ?? tomorrowStartTime.toISOString();
    
    const calendarResponse = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: from,
        timeMax: to,
        orderBy: 'startTime',
    });

    res.status(200).send(calendarResponse.data.items);
}