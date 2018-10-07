# Worge
Word + Merge = Worge

Easy and simple word merging based off of other words

## Basic Usage
```javascript
const worge = require('worge');

console.log(worge({}));
// ['']

console.log(worge({ words: ['Word', 'Merge'], threshhold: 1 }));
// ['Worge']
// Other possibilities ['Merd'], ['Word'], or ['Merge']
```

### Worge Parameters
|Parameter|Type|Default|Use|
| --- | --- | --- | --- |
|words|Array|[ ]|The pool of words to attempt to merge|
|threshold|Number|3|The amount of letters needed to match to merge|
|count|Number|1|How many unique words|
|maxLength|Number|16|Max length of unique words|
|failsThreshold|Number|10|How many times worge will attempt to find a new word before returning the current array|

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details