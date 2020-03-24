import { useState } from 'react';
import { message } from 'antd';

export function useLoading(value = false, catchHandler = (_: Error) => message.error('An error occured')) {
  const [loading, setLoading] = useState(value);
  const wrapper = <T extends any[], K = any>(action: (...args: T) => Promise<K>) => async (
    ...args: Parameters<typeof action>
  ) => {
    try {
      setLoading(true);
      return await action(...args);
    } catch (e) {
      catchHandler(e);
    } finally {
      setLoading(false);
    }
  };
  return [loading, wrapper] as const;
}
