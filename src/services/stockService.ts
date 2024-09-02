import client from '../config/redisClient';

// 新增股票價格
export const addStockPrice = async (
  symbol: string,
  timestamp: number,
  price: number
) => {
  // 使用兩個有序集合來分別儲存時間戳和價格
  await client.zAdd(`stock:price:${symbol}`, {
    score: price,
    value: timestamp.toString(),
  });
  await client.zAdd(`stock:timestamp:${symbol}`, {
    score: timestamp,
    value: price.toString(),
  });

  // 新增到全局有序集合
  await client.zAdd('global:price', {
    score: price,
    value: `${symbol}:${timestamp}`,
  });
  await client.zAdd('global:timestamp', {
    score: timestamp,
    value: `${symbol}:${price}`,
  });
};

// 獲取股票的最低和最高價格
export const getStockMinMax = async (symbol: string) => {
  const min = await client.zRangeWithScores(`stock:price:${symbol}`, 0, 0);
  const max = await client.zRangeWithScores(`stock:price:${symbol}`, -1, -1);
  return { min: min[0], max: max[0] };
};

// 獲取股票價格變動
export const getStockPriceChange = async (symbol: string) => {
  const open = await client.zRangeWithScores(`stock:timestamp:${symbol}`, 0, 0);
  const current = await client.zRangeWithScores(
    `stock:timestamp:${symbol}`,
    -1,
    -1
  );

  if (open.length > 0 && current.length > 0) {
    const change =
      ((parseFloat(current[0].value) - parseFloat(open[0].value)) /
        parseFloat(open[0].value)) *
      100;
    return {
      open: parseFloat(open[0].value),
      current: parseFloat(current[0].value),
      change,
    };
  }
  return null;
};

// 獲取全局最低和最高價格
export const getGlobalMinMax = async () => {
  const min = await client.zRangeWithScores('global:price', 0, 0);
  const max = await client.zRangeWithScores('global:price', -1, -1);
  return { min: min[0], max: max[0] };
};

// 獲取全局最新價格
export const getGlobalLatest = async () => {
  const latest = await client.zRangeWithScores('global:timestamp', -1, -1);
  return latest[0];
};
