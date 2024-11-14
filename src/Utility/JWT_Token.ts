import jwt from "jsonwebtoken";
import "dotenv-flow/config";

class TokenManager {
  public generateToken(data: any, expiry: string | number) {
    const token = jwt.sign({ data }, process.env.JWT_SECRET_KEY!, {
      expiresIn: expiry,
    });
    return token;
  }

  public verifyToken(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    return decoded;
  }
}

export default TokenManager;
