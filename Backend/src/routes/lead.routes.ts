import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';
import {
  createLeadValidation,
  updateLeadValidation,
  leadsQueryValidation,
} from '../validations/lead.validation';
import protect from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/role.middleware';

const router = Router();

// All lead routes require authentication
router.use(protect);

// GET /api/leads?page=1&limit=10&status=New&source=Website&search=John&sort=latest
router.get('/', leadsQueryValidation, getLeads);

// GET /api/leads/export — Export as CSV (accessible to all authenticated users)
router.get('/export', exportLeads);

// GET /api/leads/:id
router.get('/:id', getLead);

// POST /api/leads
router.post('/', createLeadValidation, createLead);

// PUT /api/leads/:id
router.put('/:id', updateLeadValidation, updateLead);

// DELETE /api/leads/:id — Admin only
router.delete('/:id', authorizeRoles('Admin'), deleteLead);

export default router;
