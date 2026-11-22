import { redirect } from "next/navigation";

import { lessons } from "@/content/catalog";
import { lessonHref } from "@/content/types";

export default function LessonsPage() {
  redirect(lessonHref(lessons[0]));
}
