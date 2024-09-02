import {
  addStockPrice,
  getStockMinMax,
  getStockPriceChange,
  getGlobalMinMax,
  getGlobalLatest,
} from '../services/stockService';
import client from '../config/redisClient';

// 範例
(async () => {
  try {
    // 新增範例股票價格
    await addStockPrice('AAPL', 1623840000, 150);
    await addStockPrice('AAPL', 1623843600, 155);
    await addStockPrice('AAPL', 1623847200, 130);
    await addStockPrice('AAPL', 1624847200, 145);

    await addStockPrice('GOOGL', 1623840000, 2500);
    await addStockPrice('GOOGL', 1623843600, 2550);
    await addStockPrice('GOOGL', 1622843600, 2450);
    await addStockPrice('GOOGL', 1623847200, 2600);
    await addStockPrice('GOOGL', 1624847200, 2700);

    // 獲取 AAPL 的最低和最高價格
    const { min: minAAPL, max: maxAAPL } = await getStockMinMax('AAPL');
    console.log(`AAPL Lowest Price: ${minAAPL.score} at ${minAAPL.value}`);
    console.log(`AAPL Highest Price: ${maxAAPL.score} at ${maxAAPL.value}`);

    // 獲取 GOOGL 的最低和最高價格
    const { min: minGOOGL, max: maxGOOGL } = await getStockMinMax('GOOGL');
    console.log(`GOOGL Lowest Price: ${minGOOGL.score} at ${minGOOGL.value}`);
    console.log(`GOOGL Highest Price: ${maxGOOGL.score} at ${maxGOOGL.value}`);

    // 獲取 AAPL 的價格變動
    const priceChangeAAPL = await getStockPriceChange('AAPL');
    if (priceChangeAAPL) {
      console.log(`AAPL Open Price: ${priceChangeAAPL.open}`);
      console.log(`AAPL Current Price: ${priceChangeAAPL.current}`);
      console.log(`AAPL Price Change: ${priceChangeAAPL.change.toFixed(2)}%`);
    }

    // 獲取 GOOGL 的價格變動
    const priceChangeGOOGL = await getStockPriceChange('GOOGL');
    if (priceChangeGOOGL) {
      console.log(`GOOGL Open Price: ${priceChangeGOOGL.open}`);
      console.log(`GOOGL Current Price: ${priceChangeGOOGL.current}`);
      console.log(`GOOGL Price Change: ${priceChangeGOOGL.change.toFixed(2)}%`);
    }

    // 獲取全局最低和最高價格
    const { min: globalMin, max: globalMax } = await getGlobalMinMax();
    console.log(
      `Global Lowest Price: ${globalMin.score} at ${globalMin.value}`
    );
    console.log(
      `Global Highest Price: ${globalMax.score} at ${globalMax.value}`
    );

    // 獲取全局最新價格
    const globalLatest = await getGlobalLatest();
    console.log(
      `Global Latest Price: ${globalLatest.value} at ${globalLatest.score}`
    );
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // 確保客戶端正確斷開連接
    await client.quit();
  }
})();
