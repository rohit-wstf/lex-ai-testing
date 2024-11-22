export const fetchData = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | string,
  body?: any,
  headers?: Record<string, string>
): Promise<T> => {
  try {
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${response.statusText}`
      );
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error: any) {
    throw error;
  }
};
