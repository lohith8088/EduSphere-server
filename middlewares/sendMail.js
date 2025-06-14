import { createTransport } from "nodemailer"

 const sendmail=async(email,subject,data)=>{
  const transport = createTransport({
    host :"smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
      user:process.env.EMAIL,
      pass:process.env.PASSWORD,
    }
  });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>OTP Verification</title>
<style>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f4f6f8;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    padding: 20px;
  }

  .container {
    background-color: #fff;
    max-width: 400px;
    width: 100%;
    padding: 30px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    text-align: center;
  }

  h1 {
    color: #3a3a3a;
    font-weight: 600;
    margin-bottom: 18px;
  }

  p.message {
    font-size: 1rem;
    margin-bottom: 30px;
    color: #555;
  }

  .otp {
    font-family: 'Courier New', Courier, monospace;
    font-size: 2.8rem;
    letter-spacing: 0.5em; /* space between digits */
    color: #5c6bc0; /* calm purple */
    background-color: #e8eaf6;
    padding: 15px 0;
    border-radius: 8px;
    user-select: text;
    max-width: 280px;
    margin: 0 auto;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  }

  @media (max-width: 480px) {
    .container {
      padding: 25px 20px;
    }
    .otp {
      font-size: 2.2rem;
      letter-spacing: 0.4em;
      max-width: 100%;
    }
  }
</style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p class="message">Hello ${data.name}, your One-Time Password (OTP) for account verification is:</p>
    <p class="otp">${data.otp}</p>
  </div>
</body>
</html>

`;
  await transport.sendMail({
    from:process.env.EMAIL,
    to:email,
    subject,
    html,
  })
}
export default sendmail;
