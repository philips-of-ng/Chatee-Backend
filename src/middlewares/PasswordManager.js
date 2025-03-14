import argon2 from 'argon2'

export const hashPassword = async (plainPassword) => {
  try {
    const hashedPassword = await argon2.hash(plainPassword)
    console.log('Hashed Password of New User');
    return hashedPassword
  } catch (error) {
    console.log('Error hashing password:', error);
  }
}

export const comparePasswords = async (plainPassword, storeHashedPassword) => {

  if (!plainPassword || !storeHashedPassword) {
    console.log('No password provided');
    return false
  }

  try {

    console.log('Stored hashed pw i got', storeHashedPassword);
    

    const isCorrect = await argon2.verify(storeHashedPassword, plainPassword)
    if (isCorrect) {
      console.log('Password Matches.');
      return true
    } else {
      console.log('Password doesnt match');
      return false
    }
  } catch (error) {
      console.log('Error verifying password:', error);
  }
}