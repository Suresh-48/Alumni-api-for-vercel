import admin from "firebase-admin";

// import serviceAccount from "../firebase.js";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

export default async function sendNotification(token, body) {
  try {
    const title = "Alumni";
    const fcmToken = token;
    const message = {
      notification: {
        title,
        body,
      },
      token: fcmToken,
    };
    await admin
      .messaging()
      .send(message)
      .then((res) => console.log(`res`, res));
    console.log("Message Send Successfully");
  } catch (err) {
    console.log("Something went wrong!", err);
  }
}

export async function checkNotification(req, res) {
  try {
    const { title, body, imageUrl, token } = req.body;
    const tokens = [token];
    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
      },
    });
    res.status(200).json({ message: "Successfully sent notifications!!!" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Something went wrong!" });
  }
}
