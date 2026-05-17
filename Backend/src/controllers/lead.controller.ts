import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import asyncHandler from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import * as leadService from '../services/lead.service';
import { checkValidation } from '../services/auth.service';
import { CreateLeadBody, UpdateLeadBody, LeadQueryParams } from '../types/lead.types';

type IdParams = ParamsDictionary & { id: string };

export const getLeads = asyncHandler<ParamsDictionary, unknown, unknown, LeadQueryParams>(
  async (req: Request<ParamsDictionary, unknown, unknown, LeadQueryParams>, res: Response): Promise<void> => {
    checkValidation(req);
    const { leads, meta } = await leadService.getAllLeads(req.query, req.user!);
    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: 'Leads fetched.',
      data: leads,
      meta: meta as unknown as Record<string, unknown>,
    });
  }
);

export const getLead = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response): Promise<void> => {
    const lead = await leadService.getLeadById(req.params.id, req.user!);
    sendResponse({ res, statusCode: 200, success: true, message: 'Lead fetched.', data: lead });
  }
);

export const createLead = asyncHandler<ParamsDictionary, unknown, CreateLeadBody>(
  async (req: Request<ParamsDictionary, unknown, CreateLeadBody>, res: Response): Promise<void> => {
    checkValidation(req);
    const lead = await leadService.createLead(req.body, req.user!.id);
    sendResponse({ res, statusCode: 201, success: true, message: 'Lead created successfully.', data: lead });
  }
);

export const updateLead = asyncHandler<IdParams, unknown, UpdateLeadBody>(
  async (req: Request<IdParams, unknown, UpdateLeadBody>, res: Response): Promise<void> => {
    checkValidation(req);
    const lead = await leadService.updateLead(req.params.id, req.body, req.user!);
    sendResponse({ res, statusCode: 200, success: true, message: 'Lead updated successfully.', data: lead });
  }
);

export const deleteLead = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response): Promise<void> => {
    await leadService.deleteLead(req.params.id);
    sendResponse({ res, statusCode: 200, success: true, message: 'Lead deleted successfully.' });
  }
);

export const exportLeads = asyncHandler<ParamsDictionary, unknown, unknown, LeadQueryParams>(
  async (req: Request<ParamsDictionary, unknown, unknown, LeadQueryParams>, res: Response): Promise<void> => {
    const { status, source, search } = req.query;
    const csv = await leadService.exportLeadsAsCSV({ status, source, search }, req.user!);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  }
);
