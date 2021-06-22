#! /usr/bin/env node

const fetch = require('node-fetch');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 6,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

function getArg(argNameAbbrev, argName) {
  const allArgs = process.argv;
  let i;

  for (i = 0; i < allArgs.length; i++) {
    if (allArgs[i] == argNameAbbrev || allArgs[i] == argName) {
      break;
    }
  }

  return allArgs[i + 1];
}

function average(nums) {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  return sum / nums.length;
}

function genTodos(n) {
	return Array.from(Array(n), () => {
		const completed = Math.round(Math.random());
    return {
      title: lorem.generateWords(3),
      description: lorem.generateParagraphs(1),
      completed: Boolean(completed),
    };
  });
}

(async () => {
  const num = parseInt(getArg('-n', '--number'));
  const todos = genTodos(num);
  const results = [];

  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i];
    const start = process.hrtime();
    const log = await fetch(getArg('-u', '--url'), {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(todo),
    }).then(async (res) => res.text());

    const micros = process.hrtime(start)[1] / 1000;
    console.log(log, 'in', micros + 'μs');
    results.push(micros);
  }

  console.log(
    'Average time for req+res: ',
    average(results) + 'μs'
  );
})();
