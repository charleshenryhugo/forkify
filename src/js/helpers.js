import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Make a GET or POST AJAX call
 * @param {String} url the target api end point
 * @param {JSON | undefined} jsonData JSON string to be post
 * @returns {Object} response data from api
 * @throws {Error}
 * @todo support more options
 * @author ZHU YUE
 */
export const AJAX = async function (url, jsonData = undefined) {
  const fetchPromise = jsonData
    ? await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
    : await fetch(url);

  const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${data.message} (${response.status})`);
  }

  return data;
};
