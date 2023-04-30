export interface FirebaseUserInterface {
  success: boolean
  userData?: {
    user?: {
      uid: string
      email: string
      createdAt: string
      lastLoginAt: string
    }
  }
}