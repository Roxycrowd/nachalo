export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function readError(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (payload && typeof payload === "object" && "message" in payload) {
      const message = (payload as { message?: unknown }).message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) {
        return message.filter((item) => typeof item === "string").join(" ");
      }
    }
  } catch {
    return response.statusText || "Не удалось выполнить запрос";
  }

  return response.statusText || "Не удалось выполнить запрос";
}
