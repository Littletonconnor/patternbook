import { iconsThroughIcon } from "./iconsThroughIcon.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

function message(name: string) {
  return `Render ${name} through <Icon icon={${name}} /> from @/ui/Icon, so stroke width and size come from one place (RFC 0002 part 6).`;
}

ruleTester.run("icons-through-icon", iconsThroughIcon, {
  valid: [
    {
      code: 'import { Menu } from "lucide-react";\nexport const MenuButton = () => <Icon icon={Menu} />;',
      filename: "src/components/shell/TopBar.tsx",
    },
    {
      code: 'import type { LucideIcon } from "lucide-react";\nexport const Glyph = ({ icon: Shape }: { icon: LucideIcon }) => <Shape />;',
      filename: "src/ui/Icon.tsx",
    },
    {
      code: 'import { type LucideIcon } from "lucide-react";\nexport const Glyph = (Shape: LucideIcon) => <LucideIcon />;',
      filename: "src/ui/Badge.tsx",
    },
  ],
  invalid: [
    {
      code: 'import { Menu } from "lucide-react";\nexport const MenuButton = () => <Menu size={16} />;',
      filename: "src/components/shell/TopBar.tsx",
      errors: [{ message: message("Menu") }],
    },
    {
      code: 'import { ChevronRight as Next } from "lucide-react";\nexport const Pager = () => <Next />;',
      filename: "src/components/lesson/Pager.tsx",
      errors: [{ message: message("Next") }],
    },
  ],
});
