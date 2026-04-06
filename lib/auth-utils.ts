import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a unique Customer ID in the format KH-YYYY-XXXX
 */
export async function generateCustomerId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `KH-${currentYear}-`;
  
  // Find the latest customer added this year
  const lastCustomer = await prisma.customer.findFirst({
    where: {
      customer_id: {
        startsWith: prefix
      }
    },
    orderBy: {
      customer_id: 'desc'
    }
  });

  if (!lastCustomer) {
    return `${prefix}0001`;
  }

  // Extract the number part and increment
  const lastNumber = parseInt(lastCustomer.customer_id.split('-')[2]);
  const newNumber = (lastNumber + 1).toString().padStart(4, '0');
  
  return `${prefix}${newNumber}`;
}
