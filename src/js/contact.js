import emailjs from 'emailjs-com';

export default class Contact {
    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        
        this.initializeEmailJS();
        this.handleFormBtnClick();
    }

    /**
     * Send email on send button click
     */
    handleFormBtnClick() {
        const sendBtn = this.contactForm.querySelector('.form-btn');
        sendBtn.addEventListener('click', () => {
            this.sendEmail();
        });
    }


    /**
     * Send email with custom data
     */
    sendEmail() {
        const userName = this.contactForm.querySelector('#form-name').value;
        const userEmail = this.contactForm.querySelector('#form-email').value;
        const emailSubject = this.contactForm.querySelector('#form-subject').value;
        const emailMessage = this.contactForm.querySelector('#form-message').value;

        const emailParams = {
            serviceID: 'service_2imjab7',
            templateID: 'template_x147p0g', 
            templateParams: {
                to_name: 'Martin Houdek',
                from_name: userName,
                user_email: userEmail,
                subject: emailSubject,
                message: emailMessage
            }
        };

        emailjs.send(emailParams.serviceID, emailParams.templateID, emailParams.templateParams)
            .then(
                (response) => {
                    console.log('Email sent successfully!', response);
                    alert('Email sent successfully!');
                },
                (error) => {
                    console.error('Error:', error);
                    alert('Error sending email. Please try again later.');
                }
            );
    }


    /**
     * Init emailJS with public key
     */
    initializeEmailJS() {
        emailjs.init('17QY5w2jr6Pk9ULOU');
    }
}
