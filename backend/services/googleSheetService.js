const { google } = require('googleapis');
const path = require('path');
// Load env from backend folder explicitly
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// The ID of the spreadsheet to update.
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Initialize auth - supports both env variable (for Render) and file (for local dev)
let auth;
if (process.env.GOOGLE_CREDENTIALS_JSON) {
    // Cloud deployment: Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: SCOPES,
    });
    console.log('✅ Google Auth: Using credentials from environment variable');
} else {
    // Local development: Use credentials file
    const KEY_FILE_PATH = path.join(__dirname, '../google-credentials.json');
    auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: SCOPES,
    });
    console.log('✅ Google Auth: Using credentials from file');
}

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

    // Day names array
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    try {
        // First, get all values in column A to find the first empty row
        const getResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'A:A',
        });

        const rows = getResponse.data.values || [];
        // Find first empty row (rows.length gives us the count, next row is rows.length + 1)
        // But we need to check for truly empty cells, not just formatted ones
        let nextRow = 2; // Start after header
        for (let i = 1; i < rows.length; i++) {
            if (rows[i] && rows[i][0] && rows[i][0].toString().trim() !== '') {
                nextRow = i + 2; // +1 for 0-index, +1 for next row
            }
        }

        const now = new Date();
        const dayName = days[now.getDay()];
        const dateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        // Prepare the values
        // Columns: [Sr.no, Day, Date, Time, Name, Description, Seen (empty)]
        const values = [
            [
                nextRow - 1, // Sr.no (row number - 1, since row 2 = Sr.no 1)
                dayName,
                dateStr,
                timeStr,
                feedback.name,
                feedback.text,
                '' // Seen (empty)
            ]
        ];

        // Update the specific row
        const range = `A${nextRow}:G${nextRow}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        console.log(`✅ Feedback added to Google Sheet at row ${nextRow}.`);

    } catch (error) {
        console.error('❌ Error writing to Google Sheet:', error.message);
        if (error.code === 404) {
            console.error("   - Check if GOOGLE_SHEET_ID is correct.");
        } else if (error.code === 403) {
            console.error("   - Check if the Service Account has 'Editor' access to the Sheet.");
        }
    }
};

module.exports = { addFeedbackToGoogleSheet };
