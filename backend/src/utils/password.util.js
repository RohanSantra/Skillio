import bcrypt from "bcrypt";

/**
 * @Name : hashPassword
 * @param : password
 * @description :
 * Hashes a plain-text password using bcrypt before storing it in the database.
 * The original password is never stored directly.
 */
const hashPassword = async (password) => {
    const saltRounds = 12;

    return await bcrypt.hash(password, saltRounds);
};

/**
 * @Name : comparePassword
 * @param : password, passwordHash
 * @description :
 * Compares a plain-text password with its bcrypt hash and returns whether
 * the password is valid.
 */
const comparePassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};

export {
    hashPassword,
    comparePassword,
};