const randomPick = function randomPickInArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

const breakWords = function breakWordsDownToParts(words, threshold) {
	const parts = {};
	const keys = [];
	const combo = `|${words.filter(word => word.length > threshold).join('|')}|`;
	words.forEach((word) => {
		if (word.length > threshold) {
			for (let i = 0; i < word.length - threshold + 1; i++) {
				const segment = word.substring(i, i + threshold);
				if (!parts[segment]) {
					const backRegex = new RegExp(`${segment}[^\\d\\s|]+`, 'g');
					const backMatches = combo.match(backRegex);
					const backSet = new Set(backMatches);
					const frontRegex = new RegExp(`[^\\d\\s|]+${segment}`, 'g');
					const frontMatches = combo.match(frontRegex);
					const frontSet = new Set(frontMatches);
					if ((frontSet.size > 1 && backSet.size > 1)) {
						keys.push(segment);
						parts[segment] = {
							front: Array.from(frontSet.values()),
							back: Array.from(backSet.values()),
						}
					}
				}
			}
		}
	});
	return { keys, parts };
};

const scanWord = function scanWordForAnotherPart(word, threshold, breakdown) {
	const segment = word.substring(word.length - threshold);
	return typeof breakdown.parts[segment] !== 'undefined';
};

const mergeWord = function mergWordSegmentsIntoWord(front, back, threshold) {
	return front + back.substring(threshold, back.length);
};

const buildWord = function buildWordFromListOfWords(breakdown, threshold, maxLength) {
	if (breakdown.keys.length < 1) return '';
	let word = randomPick(breakdown.parts[randomPick(breakdown.keys)].front);
	let shortCircuit = false;
	while(scanWord(word, threshold, breakdown) && !shortCircuit) {
		const segment = word.substring(word.length - threshold);
		const wordBack = randomPick(breakdown.parts[segment].back);
		const merged = mergeWord(word, wordBack, threshold);
		if (merged.length > maxLength) shortCircuit = true;
		else word = merged;
	}
	return word;
};

const worge = function worgeWordMerge({ words = [], threshold = 3, count = 1, maxLength = 16, failsThreshold = 10 }) {
	const breakdown = breakWords(words, threshold);
	const builtWords = [];
	let fails = 0;
	while (builtWords.length < count && fails < failsThreshold) {
		const word = buildWord(breakdown, threshold, maxLength);
		if (builtWords.includes(word)) fails += 1;
		else {
			builtWords.push(word);
			fails = 0;
		}
	}
	return builtWords;
};

const test = function testFunctionsForErrors() {
	const errors = [];
	
	const mergeWordTest = mergeWord('TES', 'EST', 2).toString();
	if (mergeWordTest !== 'TEST') errors.push(`mergeWord1: 'TEST' expected, got '${mergeWordTest}'`);
	
	const mergeWordTest2 = mergeWord('TEST', 'EST', 3).toString();
	if (mergeWordTest2 !== 'TEST') errors.push(`mergeWord2: 'TEST' expected, got '${mergeWordTest2}'`);

	const breakdown = breakWords(['WORD', 'MERGE', 'WORGE'], 1);

	const breakWordsTest = JSON.stringify(breakdown);
	const breakWordsControl = JSON.stringify({ keys: ['R'], parts: { R: { front: ['WOR', 'MER'], back: ['RD', 'RGE'] } } });
	if (breakWordsTest !== breakWordsControl) {
		errors.push(`breakWords: '${breakWordsControl}' expected, got '${breakWordsTest}'`);
		return errors
	};

	const scanWordTest1 = scanWord('WOR', 1, breakdown);
	if (scanWordTest1 === false) errors.push(`scanWord: True expected, got ${scanWordTest1}`);
	const scanWordTest2 = scanWord('WO', 1, breakdown);
	if (scanWordTest2 === true) errors.push(`scanWord: False expected, got ${scanWordTest2}`);

	const buildWordTest = buildWord(breakdown, 1, 3).toString();
	if (!['MER', 'WOR'].includes(buildWordTest)) errors.push(`buildWord: 'WOR' or 'MER' expected, got '${buildWordTest}'`);

	const worgeTest1 = JSON.stringify(worge({ words: ['WORD', 'MERGE', 'WORGE'], threshold: 1, count: 4 }).sort());
	const worgeControl = JSON.stringify(['WORD', 'MERGE', 'WORGE', 'MERD'].sort());
	if (worgeTest1 !== worgeControl) errors.push(`worge: '${worgeControl}' expected, got '${worgeTest1}'`);

	return errors.length > 0 ? errors.join('\n') : 'All Tests Passed';
};

module.exports = worge;