const QTD_HTML = 1000;
const QTD_ITERATIONS = 100;

const generateRandomHTMLArray = (count = 10) => {
  const tags = ['div', 'span', 'p', 'a', 'strong', 'em', 'h1', 'h2', 'li', 'button'];
  const randomWords = ['hello', 'world', 'lorem', 'ipsum', 'click', 'submit', 'welcome', 'test', 'value', 'random'];

  const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];
  const getRandomValue = () => {
    return Math.random() > 0.5
      ? getRandomElement(randomWords)
      : Math.floor(Math.random() * 1000);
  };

  const htmlArray = [];
  for (let i = 0; i < count; i++) {
    const tag = getRandomElement(tags);
    const value = getRandomValue();
    htmlArray.push(`<${tag}>${value}</${tag}>`);
  }
  return htmlArray;
};

const REGEX = /<\/?[a-z][\s\S]*>/i;

const useRegexOutsideFuncScope = (array) => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    array.forEach(item => {
      REGEX.test(item);
    });
  }
  return performance.now() - start;
};

const useRegexInsideFuncScope = (array) => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    array.forEach(item => {
      const regex = /<\/?[a-z][\s\S]*>/i;
      regex.test(item);
    });
  }
  return performance.now() - start;
};

const useRegexWithRegExpObject = (array) => {
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    array.forEach(item => {
      const regex = new RegExp('</?[a-z][\\s\\S]*>', 'i');
      regex.test(item);
    });
  }
  return performance.now() - start;
};

const htmlContent = generateRandomHTMLArray(QTD_HTML);

console.log("\nstarted\n");

let timeToOutside = 0;
let timeToInside = 0;
let timeToRegExpObj = 0;

for (let i = 0; i < QTD_ITERATIONS; i++) {
  timeToOutside += useRegexOutsideFuncScope(htmlContent);
  timeToInside += useRegexInsideFuncScope(htmlContent);
  timeToRegExpObj += useRegexWithRegExpObject(htmlContent);

  if (i === 0) {
    console.log("Progress: 0%");
  } else if ((i + 1) % Math.ceil(QTD_ITERATIONS / 10) === 0) {
    const percent = Math.round(((i + 1) / QTD_ITERATIONS) * 100);
    console.log(`Progress: ${percent}%`);
  }
}

console.log("\nfinished\n");
console.log("summarized results:\n");

const avgOutside = timeToOutside / QTD_ITERATIONS;
const avgInside = timeToInside / QTD_ITERATIONS;
const avgRegExpObj = timeToRegExpObj / QTD_ITERATIONS;

console.log(`Outside function scope: ${avgOutside.toFixed(2)} ms`);
console.log(`Inside function scope: ${avgInside.toFixed(2)} ms`);
console.log(`RegExp object inside function: ${avgRegExpObj.toFixed(2)} ms`);

console.log(`\nDifference (Outside vs Inside): ${(avgInside - avgOutside).toFixed(2)} ms`);
console.log(`Difference (Outside vs RegExp): ${(avgRegExpObj - avgOutside).toFixed(2)} ms`);

console.log(`\nPercentage gain over Inside: ${((avgInside - avgOutside) / avgInside * 100).toFixed(2)}%`);
console.log(`Percentage gain over RegExp: ${((avgRegExpObj - avgOutside) / avgRegExpObj * 100).toFixed(2)}%\n`);
