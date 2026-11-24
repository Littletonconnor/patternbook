import { lessonBySlug, topicBySlug } from "@/content/catalog";

export const sampleTopics = [topicBySlug("git"), topicBySlug("apis")] as const;

export const sampleLesson = lessonBySlug("offset-vs-cursor-pagination");
