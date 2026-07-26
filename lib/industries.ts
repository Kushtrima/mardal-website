import { solutions } from "../content/home";

/** The industry ids, so the artwork can key a variant off each one. */
export type IndustryId = (typeof solutions.items)[number]["id"];
