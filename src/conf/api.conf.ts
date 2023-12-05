export const port = parseInt(process.env.PORT, 10) || 3000;

export const swaggerOptions = {
  title: "Template",
  description: "Template API description",
  version: "1.0",
};

export const saltOrRounds = 10;

export const jwtExpiration = 60 * 60;
