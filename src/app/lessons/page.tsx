import { redirect } from "next/navigation";

import { firstLesson } from "@/content/catalog";
import { lessonHref } from "@/content/types";

export default function LessonsPage() {
  redirect(lessonHref(firstLesson));
}
