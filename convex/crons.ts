import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();


crons.interval(
  "clear trash files",
  { seconds:60*60*24*30}, // every month
  internal.files.clearTrash,
);


export default crons;