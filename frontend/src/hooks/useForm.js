import { useState, useEffect } from 'react';

const useForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback(values);
    }
  }, [errors]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  const handleChange = (event) => {
    event.persist();
    setIsSubmitting(false);
    setValues((prevValues) => ({ ...prevValues, [event.target.name]: event.target.value }));
    setErrors((prevValues) => {
      const newErrors = JSON.parse(JSON.stringify(prevValues));
      delete newErrors[event.target.name];
      return newErrors;
    });
  };

  const isSubmitDisabled = !(Object.keys(errors).length === 0);

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitDisabled,
  };
};

export default useForm;
