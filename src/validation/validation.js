export const  validateForm = (formData, validationRules) => {
    const newErrors = {};

    validationRules.forEach(rule => {
        const { field, required } = rule;

        if (required && !formData[field]) {
            newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
        
    });

    return newErrors;
};
