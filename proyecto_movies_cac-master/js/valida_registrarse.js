document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const successMessage = document.getElementById('success-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      console.log(
        'El formulario no es válido. Por favor, corrige los errores.'
      );
      return;
    }

    const formData = new FormData(form);
    const userData = {
      nombre: formData.get('nombre'),
      apellido: formData.get('apellido'),
      email: formData.get('email'),
      password: formData.get('password'),
      fechaNacimiento: formData.get('fechaNacimiento'),
      pais: formData.get('pais'),
      terminos: formData.get('terminos') ? true : false,
    };

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      console.log('Usuario registrado:', data);

      // Mostrar mensaje de éxito
      successMessage.style.display = 'block';

      // Redirigir después de un pequeño retraso
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/pages/iniciosesion.html';
      }, 3000); // Redirige después de 3 segundos
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  });

  const validateForm = () => {
    let isValid = true;

    // Validar campo de nombre
    isValid = validateField('nombre', 'El nombre es obligatorio') && isValid;

    // Validar campo de apellido
    isValid =
      validateField('apellido', 'El apellido es obligatorio') && isValid;

    // Validar campo de email
    isValid =
      validateEmailField('email', 'El correo electrónico no es válido') &&
      isValid;

    // Validar campo de contraseña
    isValid =
      validateField('password', 'La contraseña es obligatoria') && isValid;

    // Validar campo de fecha de nacimiento
    isValid =
      validateField(
        'fechaNacimiento',
        'La fecha de nacimiento es obligatoria'
      ) && isValid;

    // Validar campo de país
    isValid = validateField('pais', 'El país es obligatorio') && isValid;

    // Validar checkbox de términos y condiciones
    const terminos = document.getElementById('terminos').checked;
    if (!terminos) {
      isValid = false;
      setErrorFor(
        document.getElementById('terminos'),
        'Debes aceptar los términos y condiciones'
      );
    } else {
      setSuccessFor(document.getElementById('terminos'));
    }

    return isValid;
  };

  const validateField = (fieldId, errorMessage) => {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    if (value === '') {
      setErrorFor(field, errorMessage);
      return false;
    } else {
      setSuccessFor(field);
      return true;
    }
  };

  const validateEmailField = (fieldId, errorMessage) => {
    const field = document.getElementById(fieldId);
    const email = field.value.trim();
    if (email === '') {
      setErrorFor(field, 'El correo electrónico es obligatorio');
      return false;
    } else if (!isEmail(email)) {
      setErrorFor(field, errorMessage);
      return false;
    } else {
      setSuccessFor(field);
      return true;
    }
  };

  const setErrorFor = (input, message) => {
    const formControl = input.closest('div');
    const errorText = formControl.querySelector('.error-text');
    formControl.classList.add('error');
    errorText.innerText = message;
    input.focus();
  };

  const setSuccessFor = (input) => {
    const formControl = input.closest('div');
    formControl.classList.remove('error');
    const errorText = formControl.querySelector('.error-text');
    errorText.innerText = '';
  };

  const isEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      const value = input.value.trim();
      if (value !== '') {
        setSuccessFor(input);
      }
    });
  });

  form.querySelectorAll('select').forEach((select) => {
    select.addEventListener('change', () => {
      const value = select.value;
      if (value !== '') {
        setSuccessFor(select);
      }
    });
  });
});
