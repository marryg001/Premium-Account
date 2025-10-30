import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getAllProducts, 
  getProductById, 
  getVoucherByCode, 
  createOrder, 
  getOrderByNumber 
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getProductById(input.id);
      }),
  }),

  vouchers: router({
    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const voucher = await getVoucherByCode(input.code.toUpperCase());
        if (!voucher || !voucher.isActive) {
          return { valid: false, discountPercent: 0 };
        }
        return { valid: true, discountPercent: voucher.discountPercent };
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(z.object({
        email: z.string().email(),
        productId: z.number(),
        discountCode: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Validate email domain
        const allowedDomains = ['gmail.com', 'protonmail.com', 'proton.me', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const emailDomain = input.email.split('@')[1]?.toLowerCase();
        
        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
          throw new Error('Please use Gmail, Proton Mail, Yahoo Mail, Hotmail, or Outlook email addresses only');
        }

        // Get product
        const product = await getProductById(input.productId);
        if (!product) {
          throw new Error('Product not found');
        }

        // Validate voucher if provided
        let discountPercent = 0;
        if (input.discountCode) {
          const voucher = await getVoucherByCode(input.discountCode.toUpperCase());
          if (voucher && voucher.isActive) {
            discountPercent = voucher.discountPercent;
          }
        }

        // Calculate final price
        const originalPrice = product.price;
        const finalPrice = Math.round(originalPrice * (1 - discountPercent / 100));

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // Create order
        await createOrder({
          orderNumber,
          email: input.email,
          productId: product.id,
          productName: product.name,
          quantity: 1,
          originalPrice,
          discountCode: input.discountCode?.toUpperCase(),
          discountPercent,
          finalPrice,
          status: 'pending',
        });

        return {
          orderNumber,
          productName: product.name,
          originalPrice,
          discountPercent,
          finalPrice,
        };
      }),

    getByNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        return await getOrderByNumber(input.orderNumber);
      }),
  }),
});

export type AppRouter = typeof appRouter;
