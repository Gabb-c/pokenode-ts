export const logRequest = (method: string, url: string, logsEnabled?: boolean): void => {
  if (logsEnabled) {
    console.log(`[ Request Config ] ${method.toUpperCase()} | ${url}`);
  }
};

export const logResponse = (status: number, cached: boolean, logsEnabled?: boolean): void => {
  if (logsEnabled) {
    console.log(`[ Response ] STATUS ${status} | ${cached ? "CACHED" : "NOT CACHED"}`);
  }
};

export const logError = (error: unknown, logsEnabled?: boolean): void => {
  if (!logsEnabled) {
    return;
  }

  const { name, message } =
    error instanceof Error ? error : { name: "UNKNOWN", message: String(error) };

  console.error(`[ Response Error ] CODE ${name} | ${message}`);
};
