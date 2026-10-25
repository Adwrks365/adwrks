/** Match web/src/lib/content/paths.ts normalizePath for scripts. */
function decodePathSegments(path) {
  return path
    .split("/")
    .map((segment) => {
      if (!segment) return segment;
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join("/");
}

export function normalizePath(input) {
  if (!input || input === "/") return "/";
  let path = input;
  if (path.startsWith("http")) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "/";
    }
  }
  if (!path.startsWith("/")) path = `/${path}`;
  path = decodePathSegments(path);
  if (!path.endsWith("/")) path = `${path}/`;
  return path;
}
