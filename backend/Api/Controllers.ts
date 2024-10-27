import { AuthController } from './Auth/AuthController';
import { RoomController } from './Room/RoomController';
import { ScheduleController } from './Schedule/ScheduleController';
import { ShiftController } from './Shift/ShiftController';
import { UserController } from './User/UserController';

export function LoadPublicControllers (router: any) {
  AuthController(router);
}

export function LoadControllers (router: any) {
  RoomController(router);
  UserController(router);
  ScheduleController(router)
  ShiftController(router)
}

export function LoadAdminControllers (router: any) {}
