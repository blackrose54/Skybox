import {
    faFile,
    faFileAudio,
    faFileCode,
    faFileCsv,
    faFileLines,
    faFilePdf,
    faFilePowerpoint,
    faFileVideo,
    faFileWord,
    faImage,
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { filetype } from "../../../convex/schema";

export const fileIconsList = new Map<typeof filetype.type,IconDefinition>([
  ["image", faImage],
  ["document", faFileWord],
  ["pdf", faFilePdf],
  ["csv", faFileCsv],
  ["json", faFileLines],
  ["video", faFileVideo],
  ["ppt", faFilePowerpoint],
  ["audio", faFileAudio],
  ["unknown", faFile],
  ["markdown", faFileCode],
]);
