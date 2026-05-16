import { body, ValidationChain } from 'express-validator';

/**
 * Validates the registration request body.
 * - name: 2–100 chars, required
 * - email: valid email format, required
 * - password: min 6 chars, required
 * - role: optional, must be 'admin' or 'sales' if provided
 */
export const registerValidator: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),

  body('role')
    .optional()
    .isIn(['admin', 'sales']).withMessage('Role must be either admin or sales.'),
];

/**
 * Validates the login request body.
 * - email: valid email format, required
 * - password: required (no length check — auth failure is more informative)
 */
export const loginValidator: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),
];
