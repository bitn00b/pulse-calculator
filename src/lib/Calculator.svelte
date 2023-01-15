<script lang="ts">
  import { Stack, Grid, Paper, NumberInput, Switch } from "@svelteuidev/core";
  import FormattedNumber from "./FormattedNumber.svelte";

  let initial: number = 100;
  let percentADay: number = 100.5;
  let iterations: number = 4;
  let days: number = 60;
  let first70Days: boolean = false;

  const MAX_TO_COMPOUND = 100_000;

  function* calculateInterest(days: number, currentValue: number, percentADay: number) {
    let profitUntilNow = 0;

    for (var day = 1; day <= days; day++) {
      const startedWith = currentValue;
      const canCompound = currentValue < MAX_TO_COMPOUND;
      let profitOfThisDay = 0;

      if (canCompound) {
        currentValue = (currentValue * percentADay) / 100;

        profitOfThisDay = currentValue - startedWith;

        if (currentValue > MAX_TO_COMPOUND) {
          currentValue = MAX_TO_COMPOUND;
        }
      } else {
        profitOfThisDay = (percentADay / 100 - 1) * currentValue;
      }

      profitUntilNow += profitOfThisDay;

      yield {
        day,
        startedWith,
        currentValue,
        canCompound,
        profitOfThisDay,
        profitUntilNow,
      };
    }
  }

  function interestForIterations({
    iterationCount = 1,
    days,
    initial,
    percentADay,
    first70Days,
  }: {
    iterationCount: number;
    days: number;
    initial: number;
    percentADay: number;
    first70Days: boolean;
  }) {
    const result = [];

    if (!initial) {
      return result;
    }

    for (let iteration = 1; iteration <= iterationCount; iteration++) {
      const startOfIteration = initial;

      const daysToCalculate = iteration === 1 && days === 60 && first70Days ? 70 : days;

      const interests = [...calculateInterest(daysToCalculate, startOfIteration, percentADay)];
      const lastDay = interests[interests.length - 1];
      const amountAfterFees =
        startOfIteration + lastDay.profitUntilNow * 0.95 /* pulse withdraw */ * 0.91; /* VFX sell tax */

      console.warn({ iteration, lastDay, amountAfterFees });
      // console.table(interests);

      const profit = amountAfterFees - startOfIteration;

      result.push({
        iteration,
        interests,
        amountAfterFees,
        initial: startOfIteration,
        profit,
      });

      initial = amountAfterFees < MAX_TO_COMPOUND ? amountAfterFees : MAX_TO_COMPOUND;
    }

    return result;
  }

  $: interestPerIteration = interestForIterations({
    iterationCount: iterations,
    days,
    initial,
    percentADay,
    first70Days,
  });
  $: totalProfit = interestPerIteration.reduce((prev, cur) => {
    return prev + cur.profit;
  }, 0);
</script>

<Stack>
  <Grid>
    <Grid.Col lg={4} xs={12}>
      <Paper>
        <h2 style="margin-bottom: 0">
          Total interest / earnings: $<FormattedNumber animate={true} number={totalProfit} notation="standard" />
        </h2>

        Percentage profit: <FormattedNumber
          animate={true}
          notation="standard"
          number={(100 / initial) * totalProfit}
        />%
      </Paper>
    </Grid.Col>
    <Grid.Col lg={8} xs={12}>
      <Paper>
        <div class="config">
          <div class="config-entry">
            <NumberInput placeholder="Initial Amount" label="Initial Amount" bind:value={initial} />
          </div>
          <div class="config-entry">
            <NumberInput placeholder="Iterations" label="Iterations" bind:value={iterations} />
          </div>
          <div class="config-entry">
            <span
              >Days: <select bind:value={days}>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </select>
            </span>
            {#if days === 60}
              <span>
                <Switch bind:checked={first70Days} label="First Iteration 70 Days?" class="inline-flex" />
              </span>
            {/if}

            <br />
            <br />
            <span>
              Percent per Day: <select bind:value={percentADay}>
                <option value={100.5}>0.5</option>
                <option value={101.0}>1.0</option>
                <option value={101.5}>1.5</option>
                <option value={102}>2</option>
                <option value={102.5}>2.5</option>
              </select>
            </span>
          </div>
        </div>
      </Paper>
    </Grid.Col>
  </Grid>

  <div>
    <Grid>
      {#each interestPerIteration as iteration}
        <Grid.Col xs={6} sm={4} md={3} lg={2}>
          Iteration: {iteration.iteration} <br />
          <Paper>
            <div class="details">
              Amount after Fees: $<FormattedNumber number={iteration.amountAfterFees} /> <br />
              Profit: $<FormattedNumber number={iteration.profit} /> <br />
            </div>

            <table style="width: 100%;" class="fixed-header">
              <tr>
                <th style="text-align: left">Day</th>
                <th style="text-align: left">Start</th>
                <th style="text-align: left">End</th>
                <th>Profit</th>
              </tr>
              <!-- actual data for the hidden row, to have the same-ish header widths -->
              <tr style="opacity: 0; height: 0">
                <td>{days}</td>
                <td><FormattedNumber number={iteration.interests[iteration.interests.length -1].startedWith} /></td>
                <td><FormattedNumber number={iteration.interests[iteration.interests.length -1].currentValue} /></td>
                <td><FormattedNumber number={iteration.interests[iteration.interests.length -1].profitOfThisDay} /></td>
              </tr>
              </table>
              <div class="scroll">
            <table style="width: 100%;" class="scrolling-table">
              <tr style="opacity: 0">
                <th style="text-align: left">Day</th>
                <th style="text-align: left">Start</th>
                <th style="text-align: left">End</th>
                <th>Profit</th>
              </tr>
              <tbody>
                {#each iteration.interests as dailyInterest}
                  <tr>
                    <td>{dailyInterest.day}</td>
                    <td>$<FormattedNumber number={dailyInterest.startedWith} /> </td>
                    <td>$<FormattedNumber number={dailyInterest.currentValue} /></td>
                    <td style="text-align: center">
                      $<FormattedNumber number={dailyInterest.profitOfThisDay} />
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          </Paper>
        </Grid.Col>
      {/each}
    </Grid>
  </div>
</Stack>

<style lang="scss">
  .config {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .config-entry {
    flex: 0 0 calc(32% - 1rem);
  }

  .scroll {
    height: 17.5rem;
    overflow: auto
  }

  .fixed-header {
    margin-bottom: -2rem;;
  }

  .scrolling-table {
    margin-top: -2rem;
  }
</style>
