import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (plainPassword: string) => {
  try {
    // return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};
