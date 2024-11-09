export function saveAuthHeaders(response: Response): void {
  const accessToken = response.headers.get("access-token");
  const client = response.headers.get("client");
  const uid = response.headers.get("uid");

  if (accessToken && client && uid) {
    localStorage.setItem("access-token", accessToken);
    localStorage.setItem("client", client);
    localStorage.setItem("uid", uid);
  }
}
