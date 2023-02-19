export const toJSON = <T extends object = object>(
  params: T,
  init: ResponseInit = {}
): Response => {
  return new Response(JSON.stringify(params), {
    ...init,
    headers: { ...(init?.headers ?? {}), "content-type": "application/json" },
  });
};
