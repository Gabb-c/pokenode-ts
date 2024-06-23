import { baseHandler } from "../../utils/base-handler";
import {
  MOCK_BERRY,
  MOCK_BERRY_FIRMNESS,
  MOCK_BERRY_FIRMNESS_LIST,
  MOCK_BERRY_FLAVOR,
  MOCK_BERRY_FLAVOR_LIST,
  MOCK_BERRY_LIST,
} from "./data";

export const BERRY_HANDLERS = [
  baseHandler("/berry", MOCK_BERRY, "cheri"),
  baseHandler("/berry", MOCK_BERRY, "1"),
  baseHandler("/berry-firmness", MOCK_BERRY_FIRMNESS, "very-soft"),
  baseHandler("/berry-firmness", MOCK_BERRY_FIRMNESS, "1"),
  baseHandler("/berry-flavor", MOCK_BERRY_FLAVOR, "spicy"),
  baseHandler("/berry-flavor", MOCK_BERRY_FLAVOR, "1"),
  baseHandler("/berry", MOCK_BERRY_LIST),
  baseHandler("/berry-firmness", MOCK_BERRY_FIRMNESS_LIST),
  baseHandler("/berry-flavor", MOCK_BERRY_FLAVOR_LIST),
];
