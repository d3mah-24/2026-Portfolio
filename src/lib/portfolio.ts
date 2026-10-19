import data from "@/data/portfolio.json";

export type CurrentWork = {
  text?: string;
  company?: string;
  url?: string;
};

// portfolio.json may leave currentWork empty ({}), so every field is optional.
export const currentWork: CurrentWork = data.personal.currentWork;
