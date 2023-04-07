import { Types } from 'mongoose';

const getUser = ({ User }) => async ({ userId: _userId }) => {
  const userId = new Types.ObjectId(_userId);
  const user = await User.findOne({ _id: userId });
  return user;
};

export default getUser;
