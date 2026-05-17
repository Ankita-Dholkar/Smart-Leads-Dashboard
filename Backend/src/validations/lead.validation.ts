import { body, query } from 'express-validator';

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;

export const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Lead name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(LEAD_SOURCES).withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),

  body('status')
    .optional()
    .isIn(LEAD_STATUSES).withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
];

export const updateLeadValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('source')
    .optional()
    .isIn(LEAD_SOURCES).withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),

  body('status')
    .optional()
    .isIn(LEAD_STATUSES).withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
];

export const leadsQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(LEAD_STATUSES).withMessage('Invalid status filter'),
  query('source').optional().isIn(LEAD_SOURCES).withMessage('Invalid source filter'),
  query('sort').optional().isIn(['latest', 'oldest']).withMessage('Sort must be latest or oldest'),
];
