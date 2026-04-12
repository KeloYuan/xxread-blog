export const BASE_PATH = import.meta.env.BASE_URL;

const normalizedBase =
  BASE_PATH === "/"
    ? "/"
    : BASE_PATH.endsWith("/")
      ? BASE_PATH
      : `${BASE_PATH}/`;

export const withBase = (path = "") => {
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath === "" ? normalizedBase : `${normalizedBase}${cleanPath}`;
};

export const stripBase = (pathname: string) => {
  const normalizedBase =
    BASE_PATH.length > 1 && BASE_PATH.endsWith("/")
      ? BASE_PATH.slice(0, -1)
      : BASE_PATH;

  if (
    normalizedBase &&
    normalizedBase !== "/" &&
    pathname.startsWith(normalizedBase)
  ) {
    const stripped = pathname.slice(normalizedBase.length);
    return stripped === "" ? "/" : stripped;
  }

  return pathname;
};
