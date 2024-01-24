import { Metadata } from "next";
import xtConfig from "..";

export const root: Metadata = {
  title: xtConfig.appName,
  description: xtConfig.appDescription,
};
