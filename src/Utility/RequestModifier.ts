import { Request } from 'express';

export interface IGetUserAuthInfoRequest extends Request {
  userDetails?: any
}