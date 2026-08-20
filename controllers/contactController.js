const nodemailer = require("nodemailer");


// ============================
// SEND CONTACT MESSAGE
// ============================

const sendContactMessage = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body;


    // ============================
    // VALIDATION
    // ============================

    if (
      !name ||
      !email ||
      !message
    ) {

      return res.status(400).json({

        message:
          "Name, email and message are required"

      });

    }


    // ============================
    // CREATE GMAIL TRANSPORTER
    // ============================

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user:
            process.env.GMAIL_USER,

          pass:
            process.env.GMAIL_APP_PASSWORD

        }

      });


    // ============================
    // EMAIL CONTENT
    // ============================

    const mailOptions = {

      from:
        process.env.GMAIL_USER,

      to:
        process.env.GMAIL_USER,

      replyTo:
        email,

      subject:
        subject ||
        "New Velmira Contact Message",

      text: `
New message from the Velmira website.

Name:
${name}

Email:
${email}

Phone:
${phone || "Not provided"}

Subject:
${subject || "No subject"}

Message:
${message}
      `,

      html: `

        <div style="
          font-family: Arial, sans-serif;
          max-width: 700px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="
            margin-bottom: 25px;
          ">
            New Velmira Contact Message
          </h2>


          <p>
            <strong>Name:</strong>
            ${name}
          </p>


          <p>
            <strong>Email:</strong>
            ${email}
          </p>


          <p>
            <strong>Phone:</strong>
            ${phone || "Not provided"}
          </p>


          <p>
            <strong>Subject:</strong>
            ${subject || "No subject"}
          </p>


          <hr />


          <h3>
            Message
          </h3>


          <p style="
            white-space: pre-line;
            line-height: 1.6;
          ">
            ${message}
          </p>


        </div>

      `

    };


    // ============================
    // SEND EMAIL
    // ============================

    await transporter.sendMail(
      mailOptions
    );


    // ============================
    // SUCCESS RESPONSE
    // ============================

    console.log(
      "CONTACT MESSAGE SENT:",
      email
    );


    res.status(200).json({

      message:
        "Message sent successfully"

    });


  } catch (error) {

    console.error(
      "Contact email error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to send message"

    });

  }

};


module.exports = {
  sendContactMessage
};