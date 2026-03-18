import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import jwksClient from "jwks-rsa";

import UserModel from "../models/userSchema.js";

const userAuthentication = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (authorization && authorization.startsWith("Bearer ")) {
            const authorizationToken = authorization.split(" ")[1];
            if (authorizationToken && authorizationToken !== "null" && authorizationToken !== "undefined") {
                const { userId } = jwt.verify(authorizationToken, process.env.JWT_SECRET_KEY)
                if (Types.ObjectId.isValid(userId)) {

                    const user = await UserModel.findById(userId).select("-password");
                    if (user.role === "user") {
                        req.user = user
                        next();
                    } else {
                        return res.status(403).json({ "status": false, "message": "Invalid Request" });
                    }

                } else {
                    return res.status(403).json({ "status": false, "message": "Invalid Request" });
                }

            } else {
                res.status(401).json({ "status": false, "message": "Authorization Failed" });
            }
        } else {
            throw new Error("Unauthorized User");
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ "status": false, "message": "Internal Server Error", "error": error });
    }
}

/* =========================
   AUTH0 VERIFY TOKEN
========================= */

// const auth0Client = jwksClient({
//   jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
// });

// const getSigningKey = (header, callback) => {
//   auth0Client.getSigningKey(header.kid, (err, key) => {
//     const signingKey = key.getPublicKey();
//     callback(null, signingKey);
//   });
// };

// const auth0VerifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ status: false, message: "Token missing" });
//     }

//     const token = authHeader.split(" ")[1];

//     jwt.verify(
//       token,
//       getSigningKey,
//       {
//         issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//         algorithms: ["RS256"]
//       },
//       (err, decoded) => {
//         if (err) {
//           return res.status(401).json({
//             status: false,
//             message: "Invalid Auth0 token"
//           });
//         }

//         if (!decoded.email_verified) {
//           return res.status(401).json({
//             status: false,
//             message: "Email not verified"
//           });
//         }

//         req.auth0User = decoded;
//         next();
//       }
//     );
//   } catch (error) {
//     return res.status(401).json({ status: false, message: "Unauthorized" });
//   }
// };
const auth0Client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true
});

const getKey = (header, callback) => {
  auth0Client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }

    if (!key) {
      return callback(new Error("Signing key not found"));
    }

    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

const auth0VerifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = auth.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      audience: "https://smartpost-api",   // 👈 MUST MATCH
      algorithms: ["RS256"]
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Auth0 token" });
      }

      req.auth0User = decoded;
      next();
    }
  );
};

export { auth0VerifyToken };
export default userAuthentication;