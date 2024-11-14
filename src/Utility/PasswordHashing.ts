import bcrypt from "bcrypt";
import "dotenv-flow/config";

class PasswordManager {
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS!));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async checkPassword(
    password: string,
    dbPassword: string
  ): Promise<boolean> {
    const isMatched = await bcrypt.compare(password, dbPassword);
    return isMatched;
  }
}

export default PasswordManager;
