import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";

const axios = require("axios");

try {
  const slackWebhook = getInput("slack-webhook");
  const details = getInput("details");
  const buttonURL = getInput("button-url");
  const payload = context.payload;
  const commitMessages = payload.head_commit.message.split("\n\n");
  const message = {
    text: "",
    attachments: [
      {
        color: "#4BB543",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${commitMessages[0]}*\n${commitMessages[1]}`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Repository*\n${payload.repository.name}`,
              },
              {
                type: "mrkdwn",
                text: `*Branch*\n${"`" + payload.ref.split("heads/")[1] + "`"}`,
              },
            ],
          },
        ],
      },
    ],
  };
  if (details) {
    message.attachments[0].blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Details*\n${details}`,
      },
    });
  }
  if (buttonURL) {
    message.attachments[0].blocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View Website",
          },
          url: buttonURL,
        },
      ],
    });
  }
  message.attachments[0].blocks.push({
    type: "context",
    elements: [
      {
        type: "plain_text",
        text: "Made with ❤️ by atomicryan",
        emoji: true,
      },
    ],
  });
  axios
    .post(slackWebhook, message)
    .then(function (response) {
      console.log("✅ Success");
      setOutput("✅ Success");
    })
    .catch(function (error) {
      console.log(error);
      setOutput(`🛑 ${error.message}`);
    });
} catch (error) {
  setFailed(error.message);
}
