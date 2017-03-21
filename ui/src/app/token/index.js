import jwtDecode from "jwt-decode";
import URI from "urijs";

import * as connectionSettings from "../config/connection";
import * as oauth from "../config/oauth";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export const getToken = (username, password) => {
	return new Promise((resolve, reject) => {
		const xmlHttp = new XMLHttpRequest();
		xmlHttp.timeout = connectionSettings.TIMEOUT;
		xmlHttp.onreadystatechange = () => onReadyStateChange(xmlHttp, resolve, reject);
		xmlHttp.ontimeout = error => reject(error);
		xmlHttp.open("POST", createTokenRequestUrl(username, password), true);
		xmlHttp.send();
	});
};

export const refreshToken = refresh_token => {
	return new Promise((resolve, reject) => {
		const xmlHttp = new XMLHttpRequest();
		xmlHttp.timeout = connectionSettings.TIMEOUT;
		xmlHttp.onreadystatechange = () => onReadyStateChange(xmlHttp, resolve, reject);
		xmlHttp.ontimeout = error => reject(error);
		xmlHttp.open("POST", createTokenRefreshUrl(refresh_token), true);
		xmlHttp.send();
	});
};

const onReadyStateChange = (xmlHttp, resolve, reject) => {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		resolve(createResultObject(xmlHttp));
	} else if (xmlHttp.status >= 400) {
		reject(createResultObject(xmlHttp));
	}
};

const createResultObject = xmlHttp => {
	const data = (xmlHttp.responseText.length > 0) ? JSON.parse(xmlHttp.responseText) : {};
	return ({
		status: xmlHttp.status,
		data
	});
};

export const createTokenRequestUrl = (username, password) =>
	URI("/oauth/token")
		.query({
			grant_type: "password",
			client_id: oauth.CLIENT_ID,
			client_secret: oauth.CLIENT_SECRET,
			username,
			password
		}).toString();

export const createTokenRefreshUrl = () =>
	URI("/oauth/token")
		.query({
			grant_type: "refresh_token",
			client_id: oauth.CLIENT_ID,
			client_secret: oauth.CLIENT_SECRET,
			refresh_token: getRefreshToken()
		}).toString();

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const setAccessToken = access_token => {
	localStorage.setItem(ACCESS_TOKEN, access_token);
};

export const setRefreshToken = refresh_token => {
	localStorage.setItem(REFRESH_TOKEN, refresh_token);
};

export const setTokens = (access_token, refersh_token) => {
	setAccessToken(access_token);
	setRefreshToken(refersh_token);
};

export const removeAccessToken = () => {
	localStorage.removeItem(ACCESS_TOKEN);
};

export const removeRefreshToken = () => {
	localStorage.removeItem(REFRESH_TOKEN);
};

export const removeTokens = () => {
	removeAccessToken();
	removeRefreshToken();
};

export const isAccessTokenExpired = token => isTokenExpired(token);

export const isRefreshTokenExpired = token => isTokenExpired(token);

export const isTokenExpired = token => {
	if (!token) return true;

	const {exp} = jwtDecode(token);
	// exp in seconds
	// token is expired if lifetime smaller then one minute
	return (exp - Math.round(Date.now() / 1000)) < 60;
};