/**
 * Width and open state of the lesson sidebar. They live on <html> as CSS variables
 * and a data attribute, so dragging never re-renders React. This file has no client
 * code so the server layout can inline the script below.
 */
export const SIDEBAR = {
  min: 200,
  max: 420,
  initial: 264,
  snap: 140,
} as const;

export const SIDEBAR_KEY = "patternbook:sidebar";

export const sidebarScript = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(SIDEBAR_KEY)})||"null");if(s&&typeof s.width==="number"){var w=Math.min(${SIDEBAR.max},Math.max(${SIDEBAR.min},Math.round(s.width)));var r=document.documentElement;r.style.setProperty("--sidebar-width",w+"px");r.style.setProperty("--sidebar-track",s.collapsed===true?"0px":w+"px");r.dataset.sidebar=s.collapsed===true?"collapsed":"open"}}catch(e){}`;
