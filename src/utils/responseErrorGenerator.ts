export const responseErrorGenerator = (error: any, statusCode: number) => {
  return {
    message: error?.message,
    statusCode: statusCode,
  };
};
