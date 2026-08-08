# Factor a Trinomial

https://ianskelskey.github.io/TrinomialFactoringPWA

I tutor math, and factoring trinomials is where a lot of students get stuck. The
answer is rarely the problem — plenty of solvers will hand you `(x + 2)(x + 3)`.
What students actually need is the middle: why you multiply `a` and `c`, where
the two numbers come from, and how the four terms group back together.

So I built the thing I kept drawing on paper.

You type in `a`, `b` and `c`, and it works through the AC method one step at a
time:

1. Multiply `a` and `c`
2. Find the pair of numbers that multiply to `ac` and add to `b`
3. Split the middle term into those two pieces
4. Group the four terms in pairs
5. Factor each pair, then pull out the bracket they share

Every step is written out and explained, not just the answer.

It handles the cases that trip students up — negative coefficients, a common
factor to pull out first, perfect squares. And when a trinomial doesn't factor
over the integers, it says so and shows the discriminant, instead of silently
failing or making something up.

Works on a phone, and installs to the home screen if you want it there.
