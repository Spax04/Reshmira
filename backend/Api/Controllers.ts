import { AuthController } from './Auth/AuthController'
import { RoomController } from './Room/RoomController'
import { UserController } from './User/UserController'

export function LoadPublicControllers (router: any) {
  AuthController(router)
}

export function LoadControllers (router: any) {
  RoomController(router)
  UserController(router)
}

export function LoadAdminControllers (router: any) {}
