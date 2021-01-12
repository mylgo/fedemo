const { fibonacci, fibonacciIterative, fibonacciMemorization } = require('../src/k-fibonacci')
const expect = require('chai').expect

describe('Fibonacci Test', () => {
  it('fibonacciIterative(), fibonacci(),fibonacciMemorization() test', () => {
    expect(fibonacciIterative(1)).to.equal(1)
    expect(fibonacciIterative(2)).to.equal(1)
    expect(fibonacciIterative(3)).to.equal(2)
    expect(fibonacciIterative(5)).to.equal(5)
    expect(fibonacciIterative(12)).to.equal(144)
    expect(fibonacciIterative(10)).to.equal(55)
    expect(fibonacciIterative(30)).to.equal(832040)
    expect(fibonacci(0)).to.equal(0)
    expect(fibonacci(2)).to.equal(1)
    expect(fibonacci(3)).to.equal(2)
    expect(fibonacci(5)).to.equal(5)
    expect(fibonacci(12)).to.equal(144)
    expect(fibonacci(10)).to.equal(55)
    expect(fibonacci(30)).to.equal(832040)
    expect(fibonacciMemorization()(1)).to.equal(1)
    expect(fibonacciMemorization()(2)).to.equal(1)
    expect(fibonacciMemorization()(3)).to.equal(2)
    expect(fibonacciMemorization()(5)).to.equal(5)
    expect(fibonacciMemorization()(12)).to.equal(144)
    expect(fibonacciMemorization()(10)).to.equal(55)
    expect(fibonacciMemorization()(30)).to.equal(832040)
  })
})
