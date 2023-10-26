import admin from "firebase-admin";

export default async function sendNotificationAll(token, messages) {
  try {
    const registrationTokens = token;
    const message = {
      data: { message: messages },
      // tokens: registrationTokens,
    };
    const options = {
      priority: "high",
      timeToLive: 1 * 1,
    };

    admin
      .messaging()
      .sendToDevice(registrationTokens, message, options)
      .then((response) => {
        // try {
        //   if (response.failureCount > 0) {
        //     const failedTokens = [];
        //     response.map((resp, idx) => {
        //       if (!resp.success) {
        //         failedTokens.push(registrationTokens[idx]);
        //       }
        //     });
        //     console.log("List of tokens that caused failures: " + failedTokens);
        //   }
        // } catch (err) {
        //   console.log(`err`, err);
        // }
      });
  } catch (err) {
    console.log(`errlog`, err);
  }
}
