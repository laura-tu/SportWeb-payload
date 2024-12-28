import { Router } from 'express'
import payload from 'payload'
//import sendPasswordEmail from '../utilities/sendPasswordEmail'

const router = Router()

router.post('/register', async (req, res) => {
  console.log('Received POST request at /register')
  const { hashedCode, email } = req.body

  try {
    const user = await payload.find({
      collection: 'users',
      where: {
        hashedCode: {
          equals: hashedCode,
        },
      },
    })

    if (!user || user.docs.length === 0) {
      return res.status(400).json({ message: 'Invalid hashed code.' })
    }

    // Generate and update password
    const generatedPassword = Math.random().toString(36).slice(-8)
    await payload.update({
      collection: 'users',
      id: user.docs[0].id,
      data: {
        password: generatedPassword,
        email,
      },
    })

    // Send email
    try {
      //await sendPasswordEmail(email, generatedPassword)
      return res.status(200).json({ message: 'Password sent to your email.' })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return res.status(500).json({ message: 'Failed to send password email.' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

export default router
