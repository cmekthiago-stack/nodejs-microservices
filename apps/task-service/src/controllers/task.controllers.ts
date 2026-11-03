import type {Request, Response, NextFunction} from 'express'
import * as taskService from '../services/task.services'
import { AppError, successResponse } from 'shared'


function requireIdentity(req: Request) {
  const userId = req.header('x-user-id')
  const role = req.header('x-user-role')
  if (!userId || !role) {
    throw new AppError("Missing user identity", 401)
  }

  return { userId, role }
}
export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {userId} = requireIdentity(req)

    const task = await taskService.createTask(req.body, userId);
    successResponse(res,{task}, 201)
  } catch (error) {
    next(error)
  }
}

export async function listTasks (
  req: Request,
  res: Response,
  next: NextFunction
){
  try{
    const {userId, role} = requireIdentity(req)
    const tasks = await taskService.listTasks(userId, role)

    successResponse(res, {tasks});

  }catch(error){
    next(error)
  }
}

export async function getSingleTask (
  req: Request,
  res: Response,
  next: NextFunction
){
  try{
    const {userId, role} = requireIdentity(req)
    const id = String(req.params.id)

    const task = await taskService.getSingleTask(id, userId, role)

    successResponse(res, {task})

  }catch(error){
    next(error)
  }
}

export async function deleteSingleTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = requireIdentity(req);
    const id = String(req.params.id);

    const deletedResult = await taskService.deleteSingleTask(id, userId, role);

    successResponse(res, deletedResult);
  } catch (error) {
    next(error);
  }
}

export async function patchSingleTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = requireIdentity(req);
    const id = String(req.params.id);

    // Pass the body so the service can actually apply changes
    const task = await taskService.patchSingleTask(id, req.body, userId, role);

    successResponse(res, { task });
  } catch (error) {
    next(error);
  }
}
