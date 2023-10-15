export const validatorRequired = (object: any, arrayFields: Array<string>) => {
  let fieldsMissing: Array<string> = [];

  arrayFields.forEach((field: string) => {
    if (!object[field]) {
      fieldsMissing.push(field);
    }
  });

  if (fieldsMissing.length > 0) {
    return {
      success: false,
      failedMessage: `${fieldsMissing.toString()} must be sent!`,
    };
  }

  return {
    success: true,
  };
};
