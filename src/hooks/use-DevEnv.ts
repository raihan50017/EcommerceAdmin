export default function useDevEnv() {
    const devEnv = "development";
    const productionEnv = "production";
    const currentEnv = process.env.NODE_ENV;

    //const currentEnv = "production";

    return { currentEnv, devEnv, productionEnv };
}