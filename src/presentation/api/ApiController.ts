import { Router } from 'express';

export interface ApiController {
  routes(): Router;
}
