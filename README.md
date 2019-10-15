# An automated robot for BurgerKing's survey

By finish an astonishingly long survey, you can receive an order of fries🍟 or a beverage for FREE. This program may help you with that!

You can take the survey using the survey code printed on BurgerKing order receipt, and retrieve a validation code after you finish it.

```
Survey Code + Validation Code = FREE Fries🍟
```

Enjoy!

## Setup

Clone the code and run:

```
npm install
```

## Usage

### Run by command-line arguments

```
npm start -- --code=<16-digit survey code>
```

### Run interactively

```
npm start
```

Then input your survey code after the prompt

## Example

### Run by arguments example

```
npm start -- --code=9702802101191131

> burgerbot@1.0.0 start /Users/****/burgerbot
> node app.js "--code=9702802101191131"

Landing page loaded
Survey started
Survey code accepted
Progress: 2%
Progress: 2%
Progress: 2%
Progress: 8%
Progress: 11%
Progress: 11%
Progress: 12%
Progress: 41%
Progress: 44%
Progress: 48%
Progress: 70%
Progress: 81%
Progress: 86%
Progress: 87%
Progress: 87%
Progress: 87%
Progress: 95%
Progress: 98%
Validation code issued
Validation code = 18901822
```

### Run by interactive prompt example

```
npm start                           

> burgerbot@1.0.0 start /Users/****/burgerbot
> node app.js

Input your 16-digit survey code: 9702802101191131
Landing page loaded
Survey started
Survey code accepted
Progress: 2%
Progress: 2%
Progress: 2%
Progress: 8%
Progress: 10%
Progress: 11%
Progress: 12%
Progress: 41%
Progress: 44%
Progress: 48%
Progress: 70%
Progress: 81%
Progress: 86%
Progress: 87%
Progress: 87%
Progress: 87%
Progress: 95%
Progress: 98%
Validation code issued
Validation code = 18901822
```

## Test

```
npm test
```

The tests may take up to one minute to finish.

## License

GPLv3