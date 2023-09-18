import Queue from "bull";
import { redisConfig } from "../config/redis";

import * as jobs from "../jobs/index";

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, redisConfig),
  key: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(name: string, data: any) {
    const queue = this.queues.find((queue) => queue.key === name);

    return queue?.bull.add(data, { removeOnComplete: true });
  },
  process() {
    return this.queues.forEach((queue: any) => {
      queue.bull.process(queue.handle);

      queue.bull.on("failed", (job: any, err: any) => {
        console.log("Job failed: ", queue.key, job.data, err);
      });

      queue.bull.on("completed", (job: any, done: any) => {
        done();
      });
    });
  },
};
