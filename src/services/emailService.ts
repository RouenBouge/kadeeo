import emailjs from '@emailjs/browser';

const SERVICE_ID = 'default_service';  // Replace with your EmailJS service ID
const TEMPLATE_ID = 'template_default'; // Replace with your EmailJS template ID
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // Replace with your EmailJS public key

interface EmailData {
  to_email: string;
  establishment_name: string;
  prize: string;
  redemption_code: string;
}

export const sendPrizeEmail = async (emailData: EmailData): Promise<void> => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      emailData,
      PUBLIC_KEY
    );
    
    if (response.status === 200) {
      console.log('Email sent successfully!');
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};