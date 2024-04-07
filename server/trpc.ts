import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(
    opts,
  ) {
    const { ctx,input } = opts;
    const user = ctx.ctx.user;
    console.log(user)
    // Check if user is authenticated
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    console.log(input)
    return opts.next();
});