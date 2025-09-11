import bcrypt from 'bcryptjs';

// Hash password before storing in database
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}

// Compare provided password with database hashed password
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
}