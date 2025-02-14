//CONTACT

function createContactForm() {
    const contactSection = document.createElement('section');
    contactSection.id = 'contact';

    const title = document.createElement('h2');
    title.textContent = 'Contact';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Vous avez un projet ? Discutons-en !';

    const form = document.createElement('form');
    form.action = '#';
    form.method = 'post';
    form.id = 'contactForm'

    const fields = [
        { type: 'text', name: 'name', label: 'Nom', validation: /^[a-zA-Z\s]{2,30}$/ },
        { type: 'email', name: 'email', label: 'Email', validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        // REGEX : Begin by one or more caracters that aren't spaces or @
        { type: 'textarea', name: 'message', label: 'Message', validation: /.{10,}/ }
        // REGEX : all characters chains with 10 charaters min, max unlimited.
    ];

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'formGroup';

        const label = document.createElement('label');
        label.htmlFor = field.name;
        label.textContent = field.label;


        const input = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
        if (field.type !== 'textarea') {
            input.type = field.type; // Define the type only if it's an <input>
          }
        input.name = field.name;
        input.id = field.name;
        input.required = true;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Envoyer';

    form.appendChild(submitButton);
    contactSection.appendChild(title);
    contactSection.appendChild(subtitle);
    contactSection.appendChild(form);

    return contactSection;
}

export {createContactForm};