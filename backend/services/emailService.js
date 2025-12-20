const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000, // Fail after 10 seconds
    socketTimeout: 10000
});

const sendUpdateEmail = async (updateType, data, reviewLink) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ Email credentials not found. Skipping email.');
        console.log(`[Mock Email] To: gadesa@rknec.edu | Subject: New ${updateType} Update!`);
        console.log(`Link: ${reviewLink}`);
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'gadesa@rknec.edu', // As requested
        subject: `🚀 Portfolio Update Available: New ${updateType} Content`,
        html: `
            <h2>New Content Detected</h2>
            <p>We found a new update from <strong>${updateType}</strong>.</p>
            <p><strong>Item:</strong> ${data.title || data.name}</p>
            <p>${data.description || 'No description'}</p>
            
            <p>Do you want to add this to your portfolio?</p>
            
            <a href="${reviewLink}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Review & Approve</a>
            
            <p>Direct Link: ${reviewLink}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

module.exports = { sendUpdateEmail };
