import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { FilterQuery } from 'mongoose';
import { Lead, ILeadDocument } from '../models/lead.model';
import { sendResponse, sendError } from '../utils/apiResponse.utils';
import { generateLeadsCsv } from '../utils/csvExport.utils';
import { LeadQueryParams, CreateLeadDTO, UpdateLeadDTO } from '../types/lead.types';

// ── Lead Controller ────────────────────────────────────────────────────────

/**
 * GET /api/leads
 * Returns paginated leads with support for filtering by status, source,
 * free-text search (name/email), and sort order.
 */
export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as unknown as LeadQueryParams;

    // Sanitize numeric pagination values
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(Math.max(1, Number(limit)), 50); // Cap at 50 per page
    const skip = (pageNum - 1) * limitNum;

    // Build query dynamically — only add filters that are actually provided
    const query: FilterQuery<ILeadDocument> = {};

    if (status) query.status = status;
    if (source) query.source = source;

    if (search && search.trim()) {
      // Case-insensitive regex search across both name and email fields
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Run count and data queries in parallel for performance
    const sortOrder = sort === 'oldest' ? 1 : -1;
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use .lean() for performance — returns plain objects
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    sendResponse(res, 200, 'Leads fetched successfully.', {
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/leads
 * Creates a new lead. Sets createdBy to the authenticated user's ID.
 */
export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed.', errors.array());
      return;
    }

    const { name, email, status, source } = req.body as CreateLeadDTO;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user!.id, // Set from authenticated user
    });

    sendResponse(res, 201, 'Lead created successfully.', lead);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/:id
 * Returns a single lead by its MongoDB ObjectId.
 */
export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).lean();

    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    sendResponse(res, 200, 'Lead retrieved successfully.', lead);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/leads/:id
 * Updates a lead. Admin can update any lead; sales can only update their own.
 */
export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, 'Validation failed.', errors.array());
      return;
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    // RBAC: Sales users can only update leads they created
    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 403, 'You can only update your own leads.');
      return;
    }

    const updateData = req.body as UpdateLeadDTO;
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true } // Return updated doc, run schema validators
    ).lean();

    sendResponse(res, 200, 'Lead updated successfully.', updatedLead);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/leads/:id
 * Deletes a lead. Admin only — enforced at the route level via requireRole().
 */
export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      sendError(res, 404, 'Lead not found.');
      return;
    }

    sendResponse(res, 200, 'Lead deleted successfully.', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/export/csv
 * Exports all leads matching the current filters as a CSV file download.
 * Admin only — enforced at the route level.
 * Does NOT paginate — returns all matching results.
 */
export const exportLeadsCsv = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as unknown as LeadQueryParams;

    // Build the same query as getLeads but without pagination
    const query: FilterQuery<ILeadDocument> = {};

    if (status) query.status = status;
    if (source) query.source = source;

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    const csvData = generateLeadsCsv(leads);

    // Set appropriate headers so the browser treats this as a file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="leads.csv"'
    );

    res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};
