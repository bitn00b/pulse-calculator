<script lang="ts">
  import {Center, Loader, Paper, Space} from "@svelteuidev/core";
  import {randomNumberBetweenZeroAnd} from "@pulse/shared/utils.ts";

  const messages = [
    'Loading Institutional Investors 🤣',
    'Who needs a FoxNews Interview?! 🤣',
    'YUGE Profits',
    'Insert loading message here',
    'FunnyDonald bigly approved. Okay',
    'Converting Mason\'s spreadsheets',
    'Smashing the compound button',
    'WEN Lambo',
    'Yo Dawg, I heard you want calculations?',
    'Bought some VFX yet?',
    'Loading 8th wonder of the world',
    'Retirement in 3.. 2.. 1!',
    'Long Term Mooon-ey',
    'Give Matt some Bon Bons Steak',
    'This is not J\'s crazy talk right here'
  ];

  const randomIndex = randomNumberBetweenZeroAnd(messages.length - 1)
</script>

<Paper>
   <Center>
      <Loader variant='bars'/>
      <Space w="20"></Space>
      {messages[randomIndex]}
   </Center>
</Paper>
