function isPrime(num) {
  if (!Number.isInteger(num) || num < 2) {
    return false;
  }
  if (num < 4) {
    return true;
  }
  if (num % 2 === 0 || num % 3 === 0) {
    return false;
  }
  // Every prime above 3 has the form 6k ± 1, so only those divisors need checking.
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) {
      return false;
    }
  }
  return true;
}

module.exports.isPrime = isPrime;
