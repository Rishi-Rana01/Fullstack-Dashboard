import { body, ValidationChain } from 'express-validator';



const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const VALID_SOURCES = ['Website', 'Instagram', 'Referral'] as const;

/**
 * Validates the create lead request body.
 * All four fields are required.
 */
export const createLeadValidator: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('Lead name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('status')
    .notEmpty().withMessage('Status is required.')
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}.`),

  body('source')
    .notEmpty().withMessage('Source is required.')
    .isIn(VALID_SOURCES).withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}.`),
];

/**
 * Validates the update lead request body.
 * All fields are optional but must be valid if provided.
 */
export const updateLeadValidator: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}.`),

  body('source')
    .optional()
    .isIn(VALID_SOURCES).withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}.`),
];
