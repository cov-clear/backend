export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = !isProduction;
export const PORT = envOrDefault('PORT', '1337');
export const DB_CONNECTION_URL = envOrDefault(
  'DB_CONNECTION',
  'postgresql://dev_user:dev_password@localhost/dev_db'
);
export const API_PREFIX = envOrDefault('API_PREFIX', '/api');

function envOrDefault(
  key: string,
  defaultValue: string,
  throwIfMissingInProd: boolean = true
): string {
  if (throwIfMissingInProd && isProduction && !process.env[key]) {
    throw new Error(
      `Critical environment config value ${key} is missing, stopping.`
    );
  }
  return process.env[key] || defaultValue;
}
