import { createClient } from 'redis';

// 建立 Redis 客戶端
const client = createClient({
  url: 'redis://127.0.0.1:6379',
});

// 錯誤處理
client.on('error', (err) => console.error('Redis error:', err));

// 連接到 Redis
client.connect().then(() => console.log('Connected to Redis'));

export default client;
