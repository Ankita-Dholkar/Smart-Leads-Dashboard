import Lead, { ILead } from '../models/Lead.model';
import AppError from '../utils/AppError';
import {
  CreateLeadBody,
  UpdateLeadBody,
  LeadQueryParams,
  PaginationMeta,
  LeadStatus,
  LeadSource,
} from '../types/lead.types';
import { IUserPayload } from '../types/auth.types';
import { Parser } from 'json2csv';

interface LeadsResult {
  leads: ILead[];
  meta: PaginationMeta;
}

export const getAllLeads = async (
  params: LeadQueryParams,
  user: IUserPayload
): Promise<LeadsResult> => {
  const {
    page = '1',
    limit = '10',
    status,
    source,
    search,
    sort = 'latest',
  } = params;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Build dynamic filter object
  const filter: Record<string, unknown> = {};

  if (user.role !== 'Admin') filter['createdBy'] = user.id;

  if (status) filter['status'] = status as LeadStatus;
  if (source) filter['source'] = source as LeadSource;
  if (search) {
    filter['$or'] = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder: Record<string, 1 | -1> = {
    createdAt: sort === 'oldest' ? 1 : -1,
  };

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email role')
      .lean(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    leads: leads as ILead[],
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

export const getLeadById = async (id: string, user: IUserPayload): Promise<ILead> => {
  const filter: Record<string, unknown> = { _id: id };
  if (user.role !== 'Admin') filter['createdBy'] = user.id;

  const lead = await Lead.findOne(filter).populate('createdBy', 'name email role');
  if (!lead) {
    throw new AppError('Lead not found or unauthorized.', 404);
  }
  return lead;
};

export const createLead = async (
  body: CreateLeadBody,
  userId: string
): Promise<ILead> => {
  const existing = await Lead.findOne({ email: body.email });
  if (existing) {
    throw new AppError('A lead with this email already exists.', 409);
  }
  return Lead.create({ ...body, createdBy: userId });
};

export const updateLead = async (
  id: string,
  body: UpdateLeadBody,
  user: IUserPayload
): Promise<ILead> => {
  const filter: Record<string, unknown> = { _id: id };
  if (user.role !== 'Admin') filter['createdBy'] = user.id;

  const lead = await Lead.findOneAndUpdate(filter, body, {
    new: true,
    runValidators: true,
  });
  if (!lead) {
    throw new AppError('Lead not found or unauthorized.', 404);
  }
  return lead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw new AppError('Lead not found.', 404);
  }
};

export const exportLeadsAsCSV = async (
  params: Omit<LeadQueryParams, 'page' | 'limit'>,
  user: IUserPayload
): Promise<string> => {
  const filter: Record<string, unknown> = {};

  if (user.role !== 'Admin') filter['createdBy'] = user.id;

  if (params.status) filter['status'] = params.status;
  if (params.source) filter['source'] = params.source;
  if (params.search) {
    filter['$or'] = [
      { name: { $regex: params.search, $options: 'i' } },
      { email: { $regex: params.search, $options: 'i' } },
    ];
  }

  const leads = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email role')
    .lean();

  const fields = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'status' },
    { label: 'Source', value: 'source' },
    { label: 'Created At', value: 'createdAt' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(leads);
};
