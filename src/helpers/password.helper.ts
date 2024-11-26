import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  return hashed;
};


export const comparePassword = async (password: string, another: string) => {
  const validPassword = await bcrypt.compare(password, another);
  return validPassword;
};
