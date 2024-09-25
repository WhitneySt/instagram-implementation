import { useState, useEffect } from "react";
import axios from "axios";

const Feed = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userMedia, setUserMedia] = useState(null);
  const [error, setError] = useState(null);
  const [publicAccountInfo, setPublicAccountInfo] = useState(null);
  const [publicAccountMedia, setPublicAccountMedia] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/instagram/auth",
        { code }
      );
      const token = response.data.access_token;
      setAccessToken(token);
      return token;
    } catch (err) {
      setError("Error al obtener el token de acceso");
      console.error("Error:", err);
    }
  };

  const getUserInfo = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/instagram/user-info",
        { accessToken: token }
      );
      setUserInfo(response.data);
    } catch (err) {
      setError("Error al obtener la información del usuario");
      console.error("Error:", err);
    }
  };

  const getUserMedia = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/instagram/user-media",
        { accessToken: token }
      );
      setUserMedia(response.data);
    } catch (err) {
      setError("Error al obtener los medios del usuario");
      console.error("Error:", err);
    }
  };

  const handleAuthentication = () => {
    const TU_APP_ID = "907662524513353";
    const TU_REDIRECT_URI =
      "https://whitneyst.github.io/instagram-implementation/";
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${TU_APP_ID}&redirect_uri=${TU_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  };

  const getPublicAccountInfo = async (username) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/instagram/public-account-info",
        {
          accessToken,
          username,
        }
      );
      setPublicAccountInfo(response.data);
      return response.data.id;
    } catch (err) {
      setError("Error al obtener la información de la cuenta pública");
      console.error("Error:", err);
    }
  };

  const getPublicAccountMedia = async (instagramAccountId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/instagram/public-account-media",
        {
          accessToken,
          instagramAccountId,
        }
      );
      setPublicAccountMedia(response.data);
    } catch (err) {
      setError("Error al obtener los medios de la cuenta pública");
      console.error("Error:", err);
    }
  };

  const handleSearch = async () => {
    const accountId = await getPublicAccountInfo(searchUsername);
    if (accountId) {
      getPublicAccountMedia(accountId);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      exchangeCodeForToken(code).then((token) => {
        if (token) {
          getUserInfo(token);
          getUserMedia(token);
        }
      });
    }
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={handleAuthentication}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Autenticar con Instagram
      </button>
      {accessToken && (
        <p className="mt-4">Token de acceso obtenido: {accessToken}</p>
      )}
      {userInfo && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Información del usuario:</h2>
          <p>ID: {userInfo.id}</p>
          <p>Username: {userInfo.username}</p>
          <p>Account Type: {userInfo.account_type}</p>
          <p>Media Count: {userInfo.media_count}</p>
        </div>
      )}
      {userMedia && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Medios del usuario:</h2>
          {userMedia.map((media) => (
            <div key={media.id} className="mt-2">
              <p>{media.caption}</p>
              {media.media_type === "IMAGE" && (
                <img
                  src={media.media_url}
                  alt={media.caption}
                  className="max-w-xs"
                />
              )}
              {media.media_type === "VIDEO" && (
                <video src={media.media_url} controls className="max-w-xs" />
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-4">
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Buscar cuenta de Instagram"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Buscar
        </button>
      </div>

      {publicAccountInfo && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">
            Información de la cuenta pública:
          </h2>
          <p>Username: {publicAccountInfo.username}</p>
          <p>Name: {publicAccountInfo.name}</p>
          <p>Followers: {publicAccountInfo.followers_count}</p>
          <p>Following: {publicAccountInfo.follows_count}</p>
          <p>Media Count: {publicAccountInfo.media_count}</p>
          <img
            src={publicAccountInfo.profile_picture_url}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
        </div>
      )}

      {publicAccountMedia && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Medios de la cuenta pública:</h2>
          <div className="grid grid-cols-3 gap-4">
            {publicAccountMedia.map((media) => (
              <div key={media.id} className="border p-2">
                {media.media_type === "IMAGE" && (
                  <img
                    src={media.media_url}
                    alt={media.caption}
                    className="w-full h-40 object-cover"
                  />
                )}
                {media.media_type === "VIDEO" && (
                  <video
                    src={media.media_url}
                    controls
                    className="w-full h-40 object-cover"
                  />
                )}
                <p className="mt-2 text-sm">
                  {media.caption
                    ? media.caption.substring(0, 50) + "..."
                    : "No caption"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default Feed;
