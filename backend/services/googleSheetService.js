const { google } = require('googleapis');
const path = require('path');
// Load env from backend folder explicitly
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Load client secrets from a local file.
// Expecting 'google-credentials.json' in the backend root or specified via env
const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '../google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// The ID of the spreadsheet to update.
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Adds a new feedback entry to the Google Sheet.
 * @param {Object} feedback - The feedback object containing name and text.
 */
const addFeedbackToGoogleSheet = async (feedback) => {
    if (!SPREADSHEET_ID) {
        console.warn("⚠️ Google Sheet ID is missing in .env. Skipping Google Sheet log.");
        return;
    }

    try {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[now.getDay()];
        const dateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY

        // Prepare the values to append
        // Columns: [Sr.no, Day, Date, Name, Description, Seen]
        // Note: For Sr.no, we can use a formula like "=ROW()-1" in the sheet itself, or fetch current rows.
        // Fetching rows adds latency. Let's send a formula for Sr.no or just a placeholder if complex.
        // Better: Use "=ROW()-1" so it auto-calculates based on row position.

        const values = [
            [
                '=ROW()-1', // Sr.no (Auto-calculated by Excel/Sheets formula)
                dayName,
                dateStr,
                feedback.name,
                feedback.text,
                'FALSE' // Seen (Checkbox, or initially false)
            ]
        ];

        const resource = {
            values,
        };

        // Append to 'Feedbacks' sheet. If sheet doesn't exist, it might fail or append to the first one.
        // We'll append to 'Sheet1' by default if 'Feedbacks' range isn't specific, but let's try 'Sheet1' or just generic append.
        // It's safer to use just the range 'A:A' or let it find the table.
        // Let's assume the user has a sheet named 'Feedbacks' or we just use the default first sheet.
        const range = 'Feedbacks!A:F';

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource,
        });

        console.log('✅ Feedback added to Google Sheet.');

    } catch (error) {
        console.error('❌ Error writing to Google Sheet:', error.message);
        if (error.code === 404) {
            console.error("   - Check if GOOGLE_SHEET_ID is correct.");
        } else if (error.code === 403) {
            console.error("   - Check if the Service Account has 'Editor' access to the Sheet.");
            console.error("   - Email to invite: <found inside google-credentials.json>");
        } else if (error.code === 400 && error.message.includes('Unable to parse range')) {
            // Fallback to Sheet1 if Feedbacks tab is missing
            try {
                console.log("   - 'Feedbacks' tab not found, trying 'Sheet1'...");
                await sheets.spreadsheets.values.append({
                    spreadsheetId: SPREADSHEET_ID,
                    range: 'Sheet1!A:F',
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: [
                            ['=ROW()-1', days[new Date().getDay()], new Date().toLocaleDateString('en-GB'), feedback.name, feedback.text, 'FALSE']
                        ]
                    },
                });
                console.log('✅ Feedback added to Google Sheet (Sheet1).');
            } catch (innerErr) {
                console.error("❌ Failed fallback to Sheet1:", innerErr.message);
            }
        }
    }
};

module.exports = { addFeedbackToGoogleSheet };
