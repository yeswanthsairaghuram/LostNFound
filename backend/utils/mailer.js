const nodemailer = require("nodemailer");
const Item = require("../models/item");
const User = require("../models/userModel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

exports.sendClaimStatusMail = async (to, name, itemTitle, status, reason, itemId) => {
  let posterDetailsHtml = "";
  if (status === "Approved" && itemId) {
    try {
      const item = await Item.findById(itemId);
      if (item?.poster) {
        const poster = await User.findById(item.poster);
        if (poster) {
          posterDetailsHtml = `
            <h3>Item Owner Details</h3>
            <p><strong>Name:</strong> ${poster.name}</p>
            <p><strong>Email:</strong> ${poster.email}</p>
          `;
        }
      }
    } catch (err) {
      console.error("Error fetching poster details:", err);
    }
  }

  const htmlContent = `
    <div style="font-family: Arial; background: #f0f8ff; padding: 20px; border-radius: 10px;">
      <h2>Claim Status Update</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your claim for <strong>${itemTitle}</strong> is now <strong>${status}</strong>.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      ${posterDetailsHtml}
      <blockquote>Because Every Item Deserves a Way Home...</blockquote>
    </div>
  `;

  await transporter.sendMail({
    from: `"Lost and Found" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your claim for "${itemTitle}" is ${status}`,
    html: htmlContent,
  });
};

exports.sendFoundItemNotification = async ({
  to, ownerName, finderName,
  itemTitle, whereFound, description, imageUrl
}) => {
  const htmlContent = `
    <div style="font-family: Arial; background: #f0f8ff; padding: 20px; border-radius: 10px;">
      <h2>Someone Might Have Found Your Item!</h2>
      <p>Hi <strong>${ownerName}</strong>,</p>
      <p><strong>${finderName}</strong> reported finding your item <strong>${itemTitle}</strong>.</p>
      <p><strong>Where:</strong> ${whereFound}</p>
      <p><strong>Description:</strong> ${description}</p>
      ${imageUrl ? `<img src="${imageUrl}" width="300"/>` : ""}
      <blockquote>Because Every Item Deserves a Way Home...</blockquote>
    </div>
  `;

  await transporter.sendMail({
    from: `"Lost and Found" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Someone found your item: ${itemTitle}`,
    html: htmlContent,
  });
};

exports.sendFoundApprovalMailToPoster = async (to, posterName, itemTitle, details) => {
  const htmlContent = `
    <div style="font-family: Arial; background: #f0f8ff; padding: 20px; border-radius: 10px;">
      <h2>Your Lost Item "${itemTitle}" May Be Recovered!</h2>
      <p>Hello <strong>${posterName}</strong>,</p>
      <p>Someone has confirmed they found your item. Details:</p>
      <ul>
        <li><strong>Where found:</strong> ${details.reason}</li>
        <li><strong>Description:</strong> ${details.contact}</li>
        <li><strong>Submitted at:</strong> ${new Date(details.submittedAt).toLocaleString()}</li>
      </ul>
      ${details.proofImage ? `<img src="${process.env.BASE_URL || "http://localhost:5000"}/uploads/${details.proofImage}" width="300"/>` : ""}
      <blockquote>Because Every Item Deserves a Way Home...</blockquote>
    </div>
  `;

  await transporter.sendMail({
    from: `"Lost and Found" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Someone found your lost item: ${itemTitle}`,
    html: htmlContent,
  });
};

exports.sendOTP = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px;">
      <h2>Password Reset OTP</h2>
      <p>Hello,</p>
      <p>Your OTP for resetting your password is:</p>
      <h1 style="color: #2a9d8f;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <br/>
      <p style="font-size: 12px; color: #555;">If you didn’t request this, you can ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from:`"Lost and Found" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: htmlContent,
    });

    console.log(` OTP sent to ${email}`);
  } catch (err) {
    console.error(" OTP Email failed:", err.message);
  }
};

exports.sendPasswordResetSuccess = async (email) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #eaf4f4; padding: 20px; border-radius: 10px;">
      <h2>Password Changed Successfully</h2>
      <p>Hello,</p>
      <p>This is a confirmation that your password was successfully changed.</p>
      <p>If you did not perform this action, please contact support immediately.</p>
      <br/>
      <p style="font-size: 12px; color: #555;">Thank you for using the Lost & Found Portal.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Lost and Found" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Changed Successfully",
      html: htmlContent,
    });

    console.log(` Password reset confirmation email sent to ${email}`);
  } catch (err) {
    console.error(" Failed to send password reset confirmation:", err.message);
  }
};


