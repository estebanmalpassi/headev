import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn(
    "\n⚠️  Falta JWT_SECRET en .env. Usando uno de desarrollo (NO seguro para producción). Generá uno con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"\n"
  );
}

// Solo para que ande en desarrollo si te olvidaste de configurarlo. En producción,
// JWT_SECRET tiene que estar seteado (si no, cualquiera puede firmar tokens válidos).
const SECRET = JWT_SECRET || "dev-insecure-secret-do-not-use-in-production";

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: "30d" });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET); // lanza si es inválido/expiró
}
