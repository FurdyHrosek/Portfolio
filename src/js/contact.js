import emailjs from 'emailjs-com';
import Helpers from './_helpers.js';
import { messageTerminationDelay } from './_config.js';

export default class Contact {
    constructor() {
        this.helpers = new Helpers();

        this.contactForm = document.querySelector('.contact-form');
        this.formInputs = this.contactForm.querySelectorAll('.form-input');
        this.formBtn = this.contactForm.querySelector('.form-btn');

        this.initializeEmailJS();
        this.handleFormBtnClick();
    }


    /**
     * Send email on send button click
     */
    handleFormBtnClick() {
        this.formBtn.addEventListener('click', () => {
            if (this.isEmailAvailable()) {
                const formMessage = this.contactForm.querySelector('.form-message');
    
                if (formMessage) {
                    formMessage.remove();
                }
    
                this.helpers.createLoadingCircle(this.formBtn);
                this.blockFormBtn();
                this.sendEmail();
            } else {
                const requiredMsg = this.createFormMsg();
                requiredMsg.textContent = 'Something wrong in the contact form!'
            }
        });
    }


    /**
     * Creates a flag to check if all form inputs are correctly filled in
     */
    isEmailAvailable() {
        let inputsFilled = true;
        let emailValid = true;
    
        this.formInputs.forEach(input => {
            const value = input.value.trim();
    
            if (value.length === 0) {
                inputsFilled = false;
                this.setInputBorder(input.parentElement, '#df0707');
            } else if (input.id === 'form-email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                emailValid = emailPattern.test(value);
                this.setInputBorder(input.parentElement, emailValid ? '#161616' : '#df0707');
            } else {
                this.setInputBorder(input.parentElement, '#161616');
            }
    
            input.addEventListener('focus', () => {
                this.setInputBorder(input.parentElement, '#161616');
            });
        });
    
        return inputsFilled && emailValid;
    }
    
    setInputBorder(element, color) {
        element.style.border = `1px solid ${color}`;
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
                    this.unblockFormBtn();
                    this.removeEmailLoader();
                    const successMsg = this.createFormMsg();
                    successMsg.textContent = 'Email successfully sent!';
                },
                (error) => {
                    this.unblockFormBtn();

                    const failMsg = this.createFormMsg();
                    failMsg.textContent = 'Email was not sent!';

                    console.error('sendEmail | Error:', error);
                }
            );
    }


    /**
     * Init emailJS with public key
     */
    initializeEmailJS() {
        emailjs.init('17QY5w2jr6Pk9ULOU');
    }

    
    /**
     * Create msg to inform user whether email was sent or not
     */
    createFormMsg() {
        const newMsg = this.contactForm.querySelector('.form-message')
            || this.helpers.createDOMElement('span', {
                classes: ['form-message']
            });
        this.formBtn.parentElement.prepend(newMsg);
    
        setTimeout(() => {
            newMsg.remove();
        }, messageTerminationDelay);

        this.removeFormMsg(newMsg);
    
        return newMsg;
    }


    /**
     * Remove form message after custom delay
     */
    removeFormMsg(newMsg) {
        setTimeout(() => {
            newMsg.remove();
        }, messageTerminationDelay);
    }


    /**
     * Remove e-mail loading circle
     */
    removeEmailLoader() {
        const loadingCircle = this.contactForm.querySelector('.loader');
        loadingCircle.remove();
    }


    /**
     * Remove e-mail loading circle
     */
    unblockFormBtn() {
        this.formBtn.disabled = false;
    }


    /**
     * Remove e-mail loading circle
     */
    blockFormBtn() {
        this.formBtn.disabled = true;
    }
}
