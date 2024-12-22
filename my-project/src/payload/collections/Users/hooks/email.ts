import type { PayloadRequest } from 'payload/types'

// Function to generate the subject for a forgot password email
export const forgotPasswordSubject = async (): Promise<string> => {
  return 'Reset Your Password'
}

// Function to generate the body for a forgot password email
export const forgotPassword = async (params: {
  req: PayloadRequest
  token: string
  user: any
}): Promise<string> => {
  const { token } = params
  const url = process.env.VERIFICATION_URL

  return `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${url}/reset-password?token=${token}">Reset Password</a>
  `
}
