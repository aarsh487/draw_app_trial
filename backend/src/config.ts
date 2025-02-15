import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, defaultValue?: string) => {
    const value = process.env[key] || defaultValue;
    if(value === undefined){
        throw Error;
    }
    return value;
}

export const JWT_SECRET = getEnv('JWT_SECRET');