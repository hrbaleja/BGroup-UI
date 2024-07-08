// src/utils/validation.js

import { nameRegex, emailRegex, passwordRegex } from 'src/validation/validationRegex';

export const validateEmail = (email) => emailRegex.test(email);
export const validatePassword = (password) => passwordRegex.test(password);
export const validateName = (name) => nameRegex.test(name)