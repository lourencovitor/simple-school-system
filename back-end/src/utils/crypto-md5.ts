import md5 from 'crypto-md5';

export const encrypt = (field: String, type = 'hex') => md5(field, type);
