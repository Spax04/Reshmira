import { AuthController } from './Auth/AuthController'
import { RoomController } from './Room/RoomController'

export function LoadPublicControllers (router: any) {
  AuthController(router)
}

export function LoadControllers (router: any) {
  RoomController(router)
}

export function LoadAdminControllers (router: any) {}
