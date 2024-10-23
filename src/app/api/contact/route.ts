import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    const msg = {
      to: 'shirshahmomand@gmail.com', // Your email address
      from: 'shirshahmomand@gmail.com', // Your SendGrid verified sender email
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<strong>Name:</strong> ${name}<br>
             <strong>Email:</strong> ${email}<br>
             <strong>Message:</strong> ${message}`,
    }

    await sgMail.send(msg)
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 })
  }
}