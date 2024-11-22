const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET;
const TOKEN_ENDPOINT = "https://www.strava.com/oauth/token";
const ATHLETES_ENDPOINT = `https://www.strava.com/api/v3/athletes/`;

const getAccessToken = async (refreshToken) => {
  const body = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body,
  });

  return response.json();
};

export const getActivities = async (athleteId, accessToken, refreshToken, page, setAccessToken, retry=false) => {
  let useThisAccessToken = accessToken;
  if (retry) {
    const { access_token } = await getAccessToken(refreshToken);
    setAccessToken(access_token)
    useThisAccessToken = access_token;
  }
  let uri = `${ATHLETES_ENDPOINT}${athleteId}`
  try {
    const response = await fetch(
      `${uri}/activities?access_token=${useThisAccessToken}&page=${page}}`
    );
    const json = await response.json();  
    if (json.errors && !retry) {
      return getActivities(athleteId, accessToken, refreshToken, page, setAccessToken, true)
    }
    else {
      return json;
    }
  } catch (error) {
    if (!retry) {
      return getActivities(athleteId, accessToken, refreshToken, page, setAccessToken, true)
    }
  }
};

export const getAuthorization = async (code) => {
  const body = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: "authorization_code",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body,
  });

  return response.json();
}