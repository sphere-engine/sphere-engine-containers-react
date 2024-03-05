import settings from "./settings";

const apiURL = settings.API_URL;

export const api = {
  createWorkspace: async (accessToken, projectId) => {
    if (accessToken.length === 0) {
      throw new Error('Empty access token');
    }

    const url = `${apiURL}/workspaces?access_token=${accessToken}`;
    const form = new FormData();
    form.append('project_id', projectId);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + accessToken,
      },
      // body: JSON.stringify({'project_id': projectId}),
      body: form,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid access token');
      } else if (response.status === 400) {
        throw new Error(await response.text());
      }
      const message = `An error has occured (code=${response.status}): ${response.statusText}`;
      console.log(response);
      throw new Error(message);
    }

    return (await response.json()).workspace;
  },
  listProjects: async (accessToken) => {
    if (accessToken.length === 0) {
      throw new Error('Empty access token');
    }

    const url = `${apiURL}/projects?access_token=${accessToken}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid access token');
      } else if (response.status === 400) {
        throw new Error(await response.text());
      }
      const message = `An error has occured (code=${response.status}): ${response.statusText}`;
      console.log(response);
      throw new Error(message);
    }

    return (await response.json()).items;
  },
  getRunningWorkspaces: async (accessToken) => {
    if (accessToken.length === 0) {
      throw new Error('Empty access token');
    }

    const url = `${apiURL}/workspaces?access_token=${accessToken}&states[]=2`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid access token');
      } else if (response.status === 400) {
        throw new Error(await response.text());
      }
      const message = `An error has occured (code=${response.status}): ${response.statusText}`;
      console.log(response);
      throw new Error(message);
    }

    return (await response.json()).items;
  },
};