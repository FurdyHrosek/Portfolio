import emailjs from 'emailjs-com';
import Helpers from '../_helpers.js';
import { messageTerminationDelay } from '../_config.js';

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
    
                this.helpers.createLoader(this.formBtn);
                this.blockFormBtn();
                this.sendEmail();
            } else {
                const requiredMsg = this.createFormMsg();
                requiredMsg.textContent = 'Something went wrong in the contact form!'
            }
        });
    }


    /**
     * Creates a flag to check if all form inputs are correctly filled in
     */
    isEmailAvailable() {
        let inputsFilled = true;
        let emailValid = true;

        const setInputBorder = (element, color) => {
            element.style.border = `1px solid ${color}`;
        }
    
        this.formInputs.forEach(input => {
            const value = input.value.trim();
    
            if (value.length === 0) {
                inputsFilled = false;
                setInputBorder(input.parentElement, '#df0707');
            } else if (input.id === 'form-email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                emailValid = emailPattern.test(value);
                setInputBorder(input.parentElement, emailValid ? '#161616' : '#df0707');
            } else {
                setInputBorder(input.parentElement, '#161616');
            }
    
            input.addEventListener('focus', () => {
                setInputBorder(input.parentElement, '#161616');
            });
        });
    
        return inputsFilled && emailValid;
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
            serviceID: 'service_w68tij9',
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
                    this.removeEmailLoader();
                    this.unblockFormBtn();

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


    removeEmailLoader() {
        const loader = this.contactForm.querySelector('.loader');
        loader.remove();
    }

    unblockFormBtn() {
        this.formBtn.disabled = false;
    }

    blockFormBtn() {
        this.formBtn.disabled = true;
    }


    /**
     * Init emailJS with public key
     */
    initializeEmailJS() {
        emailjs.init('17QY5w2jr6Pk9ULOU');
    }
}
