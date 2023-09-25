<script lang="ts">

  import dayjs from "dayjs";
  import {derived, readable} from "svelte/store";
  import utc from "dayjs/plugin/utc";
  import duration from "dayjs/plugin/duration";

  dayjs.extend(utc);
  dayjs.extend(duration);

  const time = readable(dayjs(new Date()), function start(set) {
    const interval = setInterval(() => {
      set(dayjs(new Date()));
    }, 1000);

    return function stop() {
      clearInterval(interval);
    };
  });

  /** Countdown Functions */

  const oneAm = dayjs.utc().startOf('day').add(1, 'hour');
  const now = dayjs.utc();

  const nextProfitTime = now.isBefore(oneAm) ? oneAm : oneAm.add(1, 'day');


  function getDerivedMinutesInterval(date) {
    return derived(time, now => {
      const diff = dayjs(date).diff(now);

      return 'in ' + dayjs.duration(diff).format('HH:mm:ss') + ' Hours';
    })
  }


  // const headerLabel = der

  const untilPublicStart = getDerivedMinutesInterval(nextProfitTime);


</script>

Next Profits {$untilPublicStart}
