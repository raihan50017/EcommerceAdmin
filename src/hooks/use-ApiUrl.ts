import useDevEnv from "./use-DevEnv";

export default function useApiUrl() {
  const { currentEnv, devEnv } = useDevEnv();

  const DevUrl = "http://localhost:5000/api";
  const DevRootUrl = "http://localhost:5000";

  let ProductionUrl = "http://103.28.121.112:5000/api";
  let ProductionRootUrl = "http://103.28.121.112:5000";

  if (currentEnv === devEnv) {
    ProductionUrl = DevUrl;
    ProductionRootUrl = DevRootUrl;
  }

  return { ProductionUrl, ProductionRootUrl };
}
