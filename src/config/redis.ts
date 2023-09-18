import { QueueOptions } from "bull";

export const redisConfig: QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST || "",
    port: parseInt(process.env.REDIS_PORT || "6379")
  },
};
