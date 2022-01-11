import { EMAIL_REGEX, MOBILE_REGEX } from './constant';

export const validateEmail = (emailAddress) => EMAIL_REGEX.test(String(emailAddress).toLowerCase());

export const validateLoginForm = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be 8 or more characters';
  }

  return errors;
};

export const validateSignupForm = (values) => {
  const errors = {
    ...validateLoginForm(values),
  };

  if (!values.firstName) {
    errors.firstName = 'First Name is required';
  }

  if (!values.lastName) {
    errors.lastName = 'Last Name is required';
  }

  if (!values.phone) {
    errors.phone = 'Phone Number is required';
  } else if (!MOBILE_REGEX.test(values.phone)) {
    errors.phone = 'Phone Number is invalid';
  }

  return errors;
};
