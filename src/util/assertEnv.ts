type EnvKey = keyof NodeJS.ProcessEnv;
type WritableEnv<T extends EnvKey> = Record<T, string>;
type Env<T extends EnvKey> = Readonly<WritableEnv<T>>;

const assertEnv = <T extends EnvKey>(envNames: readonly T[]): Env<T> => {
  const env = {} as WritableEnv<T>;

  for (const envName of envNames) {
    const value = process.env[envName];

    if (!value) {
      throw new TypeError(`${envName} is not set`);
    }

    env[envName] = value;
  }

  return env;
};

export {
  type Env,
  type EnvKey,
  type WritableEnv,
  assertEnv
};
