const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Temporary OTP storage (in-memory)
const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
}

// Send OTP route
router.post("/send-otp", async (req, res) => {
  const { usn, name, email } = req.body;

  if (!usn || !name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const otp = generateOTP();
  otpStore[usn] = otp;

  // Set up mail transporter
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // TLS (not SSL) for port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


  const mailOptions = {
    from: `"OTP Auth" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Hi ${name},\n\nYour OTP is: ${otp}\n\n- OTP Login System`,
  };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "OTP sent" });
//   } catch (error) {
//     console.error("Email error:", error);
//     res.status(500).json({ message: "Failed to send email" });
//   }
// });


  try {
    await transporter.sendMail({
      from: `"OTP Auth" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Hi ${name}, your OTP is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});
// Verify OTP route
router.post("/verify-otp", (req, res) => {
  const { usn, otp } = req.body;

  if (!otp || !usn) return res.status(400).json({ message: "Missing fields" });

  const storedOtp = otpStore[usn];
  if (storedOtp === otp) {
    delete otpStore[usn]; // Clear OTP after success
    return res.status(200).json({ message: "OTP verified" });
  }

  return res.status(401).json({ message: "Invalid OTP" });
});

module.exports = router;
