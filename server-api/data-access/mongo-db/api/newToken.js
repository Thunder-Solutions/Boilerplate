import { Types } from 'mongoose'
import { generateAccessToken } from 'utilities'

const newToken = ({ User }) => async ({ userId: _userId, refreshToken }) => {
  const userId = new Types.ObjectId(_userId)
  const user = await User.findOne({ _id: userId })
  if (!user.tokens.includes(refreshToken)) {
    return 'invalid'
  }
  const accessToken = generateAccessToken({
    _id: user._id.toString(),
    username: user.username,
    displayName: user.displayName,
    email: user.email,
  })
  return accessToken
}

export default newToken
