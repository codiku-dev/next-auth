import {
  deleteProduct,
  readProduct,
  updateProduct,
} from "@/app/actions/product/actions";
import {
  DeleteProductModelUriParams,
  GetProductModelUriParams,
  PatchProductModelBody,
  PatchProductModelUriParams,
} from "@/app/api/product/models";
import { safeEndPoint } from "@/libs/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     description: Get a specific product by id
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Returns the requested product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductModel'
 *       400:
 *         description: Bad request if the product id is invalid or not found
 */
export const GET = safeEndPoint(
  async (_req: NextRequest, route) => {
    try {
      const response = await readProduct(Number(route.params.id));
      return NextResponse.json(response);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  },
  true,
  GetProductModelUriParams
);

/**
 * @swagger
 * /api/product/{id}:
 *   patch:
 *     description: Update a specific product by id
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchProductModelBody'
 *     responses:
 *       200:
 *         description: Returns the updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductModel'
 *       400:
 *         description: Bad request if the product id is invalid or not found
 */
export const PATCH = safeEndPoint(
  async (_req: NextRequest, route, body) => {
    try {
      const updatedProduct = await updateProduct({
        id: Number(route.params.id),
        ...body,
      });
      return NextResponse.json(updatedProduct);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  },
  true,
  PatchProductModelUriParams,
  PatchProductModelBody
);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     description: Delete a specific product by id
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Returns a success message upon deletion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductModel'
 *       400:
 *         description: Bad request if the product id is invalid or not found
 */
export const DELETE = safeEndPoint(
  async (_req: NextRequest, route) => {
    try {
      const deletedProduct = deleteProduct(Number(route.params.id));
      return NextResponse.json(deletedProduct);
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  },
  true,
  DeleteProductModelUriParams
);
