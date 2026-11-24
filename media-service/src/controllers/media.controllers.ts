import {Request, Response, NextFunction} from 'express';
import { AppError } from '../../../packages/shared/src/errors/AppError';
import * as attachmentService from '../services/media.services'
import { successResponse } from '../../../packages/shared/src/response/response';

function requireIdentity(req: Request) {
  const userId = req.header('x-user-id')
  const role = req.header('x-user-role')
  if (!userId || !role) {
    throw new AppError("Missing user identity", 401)
  }

  return { userId, role }
}
export async function uploadAttachment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try{
    const {userId, role} = requireIdentity(req);
    const taskId = String(req.params.taskId);

    const attachment = await attachmentService.uploadAttachment({
      taskId,
      userId,
      role,
      file: req.file
    });
    
    successResponse(res, {attachment}, 201);

  } catch (error) {
    next(error)
  }
}