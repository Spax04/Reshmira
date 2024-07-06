import { AuthController } from './Auth/AuthController'

export function LoadPublicControllers (router: any) {
  AuthController(router)
}

export function LoadControllers (router: any) {}

export function LoadAdminControllers (router: any) {}
