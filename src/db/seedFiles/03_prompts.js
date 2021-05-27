// deno-lint-ignore-file
const seedPrompts = [
  {
    prompt: 'Set your pirate story aboard the fastest ship on the high seas.',
    active: true,
  },
  {
    prompt: 'Write a story that includes a flying magic carpet.',
  },
  {
    prompt:
      'Your sports team has a rematch against the defending champions that crushed you the last time you played, but this time you have a secret weapon.  What is it and how does it help you win this time around?',
  },
  {
    prompt:
      "Imagine it's 2120 and when your arrive to school, you find out you have a math test you haven't studied for. What do you do?",
  },
  {
    prompt:
      "NASA tryouts!  You've been selected to be the first kid to walk on Mars. Write about what happens when your space mission goes horribly wrong.",
  },
  {
    prompt:
      "You're an undercover park ranger tracking animal poachers in a nature preserve.  How do you protect the animals and deliver justice to the poachers? Write a scene.",
  },
  {
    prompt:
      "You're part of a crew exploring a new world and venture out to meet leaders from a newly discovered tribe of native inhabitants. Write a scene in which you negotiate peace between the two groups.",
  },
  {
    prompt: 'A character is lost in a maze and time is running out.',
  },
  {
    prompt:
      'A prince and/or princess are trapped in a castle dungeon.  How do they escape?',
  },
  { prompt: 'Two kids build a robot to fight crime.' },
  {
    prompt:
      'Everyone who ventures into the forbidden enchanted forest is never seen again.',
  },
  {
    prompt: 'Invent a new super hero who saves their city from destruction.',
  },
];

async function seed_prompts(knex) {
  await knex('prompts').insert(seedPrompts);
}

module.exports = { seed_prompts };
