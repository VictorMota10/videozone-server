export const responseErrorGenerator = (
  error: any,
  statusCode: number,
) => {
  return {
    message: error?.message ?? error,
    statusCode: statusCode,
  };
};
