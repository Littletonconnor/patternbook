import { iconsThroughIcon } from "./rules/iconsThroughIcon.mts";
import { noBarrelFiles } from "./rules/noBarrelFiles.mts";
import { noCatchAllNames } from "./rules/noCatchAllNames.mts";
import { storageInHooks } from "./rules/storageInHooks.mts";

const plugin = {
  meta: { name: "patternbook" },
  rules: {
    "icons-through-icon": iconsThroughIcon,
    "no-barrel-files": noBarrelFiles,
    "no-catch-all-names": noCatchAllNames,
    "storage-in-hooks": storageInHooks,
  },
};

export default plugin;
