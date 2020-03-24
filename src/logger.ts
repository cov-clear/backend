// TODO: this is temporary, to start logging using a centralized interface. Should be replace with a real logger.

export function info(message?: any, ...optionalParams: any[]): void {
  console.info(`[INFO] ${message}`, ...optionalParams);
}

export function error(message?: any, ...optionalParams: any[]): void {
  console.error(`[ERROR] ${message}`, ...optionalParams);
}

export function warn(message?: any, ...optionalParams: any[]): void {
  console.warn(`[WARN] ${message}`, ...optionalParams);
}

export default {
  info,
  error,
  warn,
};
