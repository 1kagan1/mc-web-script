// Basit in-memory rate limiting
// Production'da Redis kullanılmalı

const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const MAX_REQUESTS = {
  '/api/auth/login': 5,
  '/api/auth/register': 5,
  '/api/auth/forgot-password': 3,
  '/api/auth/reset-password': 5,
  '/api/market/purchase': 10,
  '/api/admin/products': 20,
};

export function checkRateLimit(ip: string, path: string): { allowed: boolean; remaining: number; resetTime: number } {
  const key = `${ip}:${path}`;
  const limit = Object.entries(MAX_REQUESTS).find(([p]) => path.startsWith(p))?.[1] || 100;
  
  const now = Date.now();
  const current = requestCounts.get(key);

  if (!current || now > current.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: limit - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }

  if (current.count >= limit) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: current.resetTime 
    };
  }

  current.count++;
  return { 
    allowed: true, 
    remaining: limit - current.count, 
    resetTime: current.resetTime 
  };
}

// Periyodik olarak eski entries'leri temizle
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60 * 1000); // Her 1 dakikada bir
