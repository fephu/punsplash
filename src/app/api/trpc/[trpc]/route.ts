import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    // responseMeta(opts) {
    //   const { ctx, paths, errors, type } = opts;

    //   const allPublic = paths && paths.every((path) => path.includes("public"));

    //   const allOk = errors.length === 0;

    //   const isQuery = type === "query";

    //   if (ctx?.res && allPublic && allOk && isQuery) {
    //     const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

    //     return {
    //       headers: {
    //         "cache-control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    //       },
    //     };
    //   }
    //   return {};
    // },
  });

export { handler as GET, handler as POST };
