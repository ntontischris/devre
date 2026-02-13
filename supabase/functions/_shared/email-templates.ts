export function newMessageEmailTemplate(
  senderName: string,
  preview: string,
  projectUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
      margin: 0;
    }
    .content {
      margin-bottom: 24px;
    }
    .message-preview {
      background-color: #f8f9fa;
      border-left: 4px solid #0066cc;
      padding: 16px;
      margin: 16px 0;
      border-radius: 4px;
      font-style: italic;
      color: #555;
    }
    .button {
      display: inline-block;
      background-color: #0066cc;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 16px;
    }
    .button:hover {
      background-color: #0052a3;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .sender {
      font-weight: 600;
      color: #0066cc;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Devre Media</h1>
    </div>

    <div class="content">
      <h2 style="margin-top: 0; color: #333;">New Message from <span class="sender">${senderName}</span></h2>

      <p>You have received a new message in your project thread:</p>

      <div class="message-preview">
        ${preview}${preview.length >= 200 ? '...' : ''}
      </div>

      <a href="${projectUrl}" class="button">View Message</a>
    </div>

    <div class="footer">
      <p>This is an automated notification from Devre Media System.</p>
      <p>If you have any questions, please contact support.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
