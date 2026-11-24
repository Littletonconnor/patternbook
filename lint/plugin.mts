import { browserApisInHooks } from "./rules/browserApisInHooks.mts";
import { coloursFromTokens } from "./rules/coloursFromTokens.mts";
import { effectsInHooks } from "./rules/effectsInHooks.mts";
import { iconsThroughIcon } from "./rules/iconsThroughIcon.mts";
import { noBarrelFiles } from "./rules/noBarrelFiles.mts";
import { noCatchAllNames } from "./rules/noCatchAllNames.mts";
import { noComments } from "./rules/noComments.mts";
import { noEnum } from "./rules/noEnum.mts";
import { optionalUndefinedOnlyInProps } from "./rules/optionalUndefinedOnlyInProps.mts";
import { typeFromTokens } from "./rules/typeFromTokens.mts";

const plugin = {
  meta: { name: "patternbook" },
  rules: {
    "colours-from-tokens": coloursFromTokens,
    "effects-in-hooks": effectsInHooks,
    "icons-through-icon": iconsThroughIcon,
    "no-barrel-files": noBarrelFiles,
    "no-catch-all-names": noCatchAllNames,
    "no-comments": noComments,
    "no-enum": noEnum,
    "browser-apis-in-hooks": browserApisInHooks,
    "type-from-tokens": typeFromTokens,
    "optional-undefined-only-in-props": optionalUndefinedOnlyInProps,
  },
};

export default plugin;
