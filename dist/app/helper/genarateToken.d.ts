import { JwtPayload, type Secret } from "jsonwebtoken";
export declare const jwtHelper: {
    generateToken: (payload: {
        email: string;
        role: string;
        secret: Secret;
        expireIn: string;
    }) => Promise<string>;
    verifyToken: (token: string, secret: Secret) => JwtPayload;
};
//# sourceMappingURL=genarateToken.d.ts.map