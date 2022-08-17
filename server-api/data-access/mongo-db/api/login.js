import { generateAccessToken, generateRefreshToken, isPasswordCorrect } from 'utilities'

const LOGIN_ERROR = 'Login unsuccessful. Please check your username and password and try again.'

const login = ({ User }) => async ({ username, password }) => {
  const _user = await User.findOne({ username })
  if (!_user) throw new Error(LOGIN_ERROR)
  const passwordCorrect = await isPasswordCorrect(password, _user.hash, _user.salt)
  if (!passwordCorrect) throw new Error(LOGIN_ERROR)
  const user = {
    _id: _user._id.toString(),
    username: _user.username,
    displayName: _user.displayName,
    email: _user.email,
  }
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  await User.findOneAndUpdate(
    { username },
    { $push: { tokens: refreshToken } },
  )
  return {
    user,
    accessToken,
    refreshToken,
  }
}

export default login
