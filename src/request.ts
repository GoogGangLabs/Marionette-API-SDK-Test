import { Constraint } from './constant';
import { FetchConfigurations } from './types';

export const Request = async <T = any, K = any>(config: FetchConfigurations<T>): Promise<K> => {
  if (!Constraint.token) throw new Error('Access token is empty');

  return await fetch(config.host, {
    method: config.method || 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Constraint.token}` },
    body: config.body ? JSON.stringify(config.body) : undefined,
  })
    .then(async (response) => {
      try {
        const payload = await response.json();

        if (response.ok) return payload;
        throw payload;
      } catch (err) {
        if (!response.ok) throw err;
        return {};
      }

      // todo: token refresh 기능 구현 시 복구

      // if (response.status !== 401) throw payload;

      // Constraint.token = (await Request({ method: "PATCH", host: `${Constraint.host}/auth/token` })).token;

      // return await Request(config);
    })
    .catch((err) => {
      throw err;
    });
};
