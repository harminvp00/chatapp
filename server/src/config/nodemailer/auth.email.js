import transport from "./transport.js";

const TEAM_EMAIL = "harminv251@gmail.com";
export async function registerEmail(username, email, subject, client) {
  await transport.sendMail({
    from: "Instant Chat",
    to: email,
    subject,
    html: `
           <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New sign-in to your QuickChat account</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #1f1f1f;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 1.6;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 48px 32px;
        box-sizing: border-box;
      "
    >
      <!-- Logo / Brand -->
      <div
        style="
          text-align: center;
          margin-bottom: 48px;
        "
      >
        <img
          src="https://img.favpng.com/22/0/2/chat-box-blue-chat-bubble-icon-for-communication-EddyCjeB_t.jpg"
          alt="QuickChat"
          width="48"
          height="48"
          style="
            display: block;
            width: 48px;
            height: 48px;
            margin: 0 auto 16px auto;
            object-fit: contain;
          "
        />

        <div
          style="
            font-size: 28px;
            line-height: 1.2;
            font-weight: 600;
            letter-spacing: -0.5px;
            color: #111111;
          "
        >
          QuickChat
        </div>
      </div>

      <!-- Greeting -->
      <div style="margin-bottom: 28px;">
        <p
          style="
            margin: 0 0 20px 0;
            font-size: 16px;
            line-height: 1.6;
            color: #1f1f1f;
          "
        >
          Hello, ${username}
        </p>

        <p
          style="
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
            color: #1f1f1f;
          "
        >
          We noticed a new sign-in to your QuickChat account.
        </p>
      </div>

      <!-- Security Message -->
      <div style="margin-bottom: 40px;">
        <p
          style="
            margin: 0 0 20px 0;
            font-size: 16px;
            line-height: 1.6;
            color: #1f1f1f;
          "
        >
          If this was you, no action is needed.
        </p>

        <p
          style="
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
            color: #1f1f1f;
          "
        >
          If you don't recognize this activity, please
          <a
            href="http://localhost:5173/profile/security"
            style="
              color: #1f1f1f;
              text-decoration: underline;
              font-weight: 500;
            "
          >
            review your account security
          </a>
          right away.
        </p>
      </div>

      <!-- Signature -->
      <div style="margin-bottom: 40px;">
        <p
          style="
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
            color: #1f1f1f;
          "
        >
          Best,
          <br />
          <strong style="font-weight: 600;">QuickChat</strong>
        </p>
      </div>

      <!-- Footer -->
      <div>
        <p
          style="
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            color: #6b6b6b;
          "
        >
          If you have any questions, please contact us through our
          <a
            href="http://localhost:5173/help-center"
            style="
              color: #1f1f1f;
              text-decoration: underline;
            "
          >
            help center
          </a>.
        </p>
      </div>
    </div>
  </body>
</html>
        `,
  });
}
