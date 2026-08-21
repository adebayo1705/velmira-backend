const { Resend } = require("resend");


// ============================
// RESEND
// ============================

const resend = new Resend(
  process.env.RESEND_API_KEY
);


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
    // CHECK RESEND API KEY
    // ============================

    if (!process.env.RESEND_API_KEY) {

      console.error(
        "RESEND_API_KEY is not configured"
      );

      return res.status(500).json({

        message:
          "Email service is not configured"

      });

    }


    // ============================
    // EMAIL CONTENT
    // ============================

    const emailSubject =
      subject ||
      "New Velmira Contact Message";


    const emailText = `
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
    `;


    const emailHtml = `

      <div style="
        font-family: Arial, sans-serif;
        max-width: 700px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background: #ffffff;
      ">

        <h2 style="
          margin-bottom: 25px;
          color: #222;
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

    `;


    // ============================
    // SEND EMAIL WITH RESEND
    // ============================

    const { data, error } =
      await resend.emails.send({

        from:
          "Velmira <onboarding@resend.dev>",

        to:
          ["adebayostephen1705@gmail.com"],

        replyTo:
          email,

        subject:
          emailSubject,

        text:
          emailText,

        html:
          emailHtml

      });


    // ============================
    // RESEND ERROR
    // ============================

    if (error) {

      console.error(
        "RESEND EMAIL ERROR:",
        error
      );

      return res.status(500).json({

        message:
          "Failed to send message"

      });

    }


    // ============================
    // SUCCESS
    // ============================

    console.log(
      "CONTACT MESSAGE SENT:",
      email
    );

    console.log(
      "RESEND EMAIL ID:",
      data?.id
    );


    return res.status(200).json({

      message:
        "Message sent successfully",

      id:
        data?.id

    });


  } catch (error) {

    console.error(
      "CONTACT EMAIL ERROR:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to send message"

    });

  }

};


// ============================
// EXPORT
// ============================

module.exports = {

  sendContactMessage

};