import { Types } from 'mongoose';

const logout = ({ User }) => async ({ userId: _userId, refreshToken, everywhere }) => {
  if (_userId) {
    const userId = new Types.ObjectId(_userId);
    const user = await User.findOne({ _id: userId });
    const logoutSingle = user && !everywhere && refreshToken;
    const logoutEverywhere = user && everywhere;
    if (logoutSingle || logoutEverywhere) {
      const operations = logoutSingle
        ? { $pull: { tokens: refreshToken } }
        : { $set: { tokens: [] } };
      await User.findOneAndUpdate(
        { _id: userId },
        operations,
      );
    }
  }
  return true; // success
};

export default logout;
