export interface DecodedAccessToken {
    roles: string[];
    type: 'access';
    sub: string;
    iat: number;
    exp: number;
    iss: string;
    aud: string;
}

export interface DecodedRefreshToken {
    type: 'refresh';
    jti: string;
    sub: string;
    iat: number;
    exp: number;
    iss: string;
    aud: string;
}