import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET: Fetch reviews for a specific product
 * Includes customer info and a "verified purchase" check
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
      include: {
        customer: {
          select: {
            full_name: true,
            avatar: true,
            orders: {
              where: {
                status: "DELIVERED",
                items: {
                  some: {
                    product_id: productId
                  }
                }
              },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedReviews = reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      customer: {
        name: r.customer.full_name,
        avatar: r.customer.avatar,
        isVerified: r.customer.orders.length > 0
      }
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}

/**
 * POST: Submit a new review
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, customerId, rating, comment } = body;

    if (!productId || !customerId || !rating) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if review already exists for this customer/product
    const existingReview = await prisma.review.findFirst({
      where: {
        product_id: productId,
        customer_id: customerId
      }
    });

    let review;
    if (existingReview) {
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: Number(rating),
          comment: comment || ""
        },
        include: {
          customer: {
            select: {
              full_name: true,
              avatar: true,
              orders: {
                where: {
                  status: "DELIVERED",
                  items: { some: { product_id: productId } }
                },
                take: 1
              }
            }
          }
        }
      });
    } else {
      review = await prisma.review.create({
        data: {
          product_id: productId,
          customer_id: customerId,
          rating: Number(rating),
          comment: comment || ""
        },
        include: {
          customer: {
            select: {
              full_name: true,
              avatar: true,
              orders: {
                where: {
                  status: "DELIVERED",
                  items: { some: { product_id: productId } }
                },
                take: 1
              }
            }
          }
        }
      });
    }

    const formattedReview = {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      customer: {
        name: review.customer.full_name,
        avatar: review.customer.avatar,
        isVerified: review.customer.orders.length > 0
      }
    };

    return NextResponse.json(formattedReview);
  } catch (error) {
    console.error("Submit review error:", error);
    return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
  }
}
