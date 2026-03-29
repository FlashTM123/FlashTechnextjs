import dns from "node:dns";
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI or DATABASE_URL in .env.local",
  );
}

/** Node (đặc biệt Windows) đôi khi querySrv cho mongodb+srv thất bại trong khi nslookup vẫn OK — ưu tiên DNS công cộng trước khi kết nối. */
function useDnsForMongoSrv(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) return;

  const extra =
    process.env.MONGODB_DNS_SERVERS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? ["1.1.1.1", "8.8.8.8"];

  try {
    dns.setServers([...new Set([...extra, ...dns.getServers()])]);
  } catch {
    /* ignore */
  }
}

// Dùng global cache để tránh tạo nhiều connection trong Next.js dev (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) {
    throw new Error(
      "Please define MONGODB_URI or DATABASE_URL in .env.local",
    );
  }
  useDnsForMongoSrv(uri);

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}
