import { newPasswordHash } from 'utilities'

const addToDo = ({ User }) => async ({ user }) => {

  const { hash, salt } = await newPasswordHash(user.password)

  const UserModel = new User({
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    hash,
    salt,
  })

  const newUser = await UserModel.save()

  return newUser
}

export default addToDo
