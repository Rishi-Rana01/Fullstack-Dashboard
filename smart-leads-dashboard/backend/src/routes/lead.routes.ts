import { Router } from 'express';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import {
  createLeadValidator,
  updateLeadValidator,
} from '../validators/lead.validator';

const router = Router();

// All lead routes require authentication — applied at the router level
router.use(authenticate);

// ── Lead Routes ─────────────────────────────────────────────────────────────
// IMPORTANT: The /export/csv route MUST be registered before /:id
// to prevent Express from treating "export" as an ObjectId.

// GET  /api/leads/export/csv  — Export filtered leads as CSV (admin only)
router.get('/export/csv', requireRole('admin'), exportLeadsCsv);

// GET  /api/leads             — Get paginated, filtered leads (all roles)
router.get('/', getLeads);

// POST /api/leads             — Create a new lead (all roles)
router.post('/', createLeadValidator, createLead);

// GET  /api/leads/:id         — Get a single lead by ID (all roles)
router.get('/:id', getLeadById);

// PUT  /api/leads/:id         — Update a lead (all roles, RBAC enforced in controller)
router.put('/:id', updateLeadValidator, updateLead);

// DELETE /api/leads/:id       — Delete a lead (admin only)
router.delete('/:id', requireRole('admin'), deleteLead);

export default router;
