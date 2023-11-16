const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

async function sendEmail(senderEmail, recipientEmail, subject, body) {
    // Create SESv2 client with your AWS credentials and region
    const client = new SESv2Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: "AKIASDANXCYJPAAWZOV7",
            secretAccessKey: "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"
        }
    });

    // Define email parameters
    const input = {
        FromEmailAddress: senderEmail,
        Destination: {
            ToAddresses: [recipientEmail]
        },
        Content: {
            Simple: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Text: {
                        Data: body
                    }
                }
            }
        },
    };

    try {
        // Create SendEmailCommand
        const command = new SendEmailCommand(input);

        // Send the email
        const response = await client.send(command);

        console.log("Email sent! Message ID:", response.MessageId);
        return response.MessageId;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
}

module.exports = {
    sendEmail
}
