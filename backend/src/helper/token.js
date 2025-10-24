import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "YRH5NF09850808585885V";
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
console.log("JWT Secret:", JWT_SECRET);


const accessToken = (_id, email) => {
  return jwt.sign(
    { _id, email },  
    JWT_SECRET,
    { expiresIn: "30d" }
  );
};


export default accessToken;