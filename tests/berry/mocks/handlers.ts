import { baseHandler } from "../../utils/base-handler";
import { MOCK_BERRY, MOCK_BERRY_LIST } from "./data";

export const BERRY_HANDLERS = [
  baseHandler("/berry", MOCK_BERRY, "cheri"),
  baseHandler("/berry", MOCK_BERRY, "1"),
  baseHandler("/berry", MOCK_BERRY_LIST),
];
