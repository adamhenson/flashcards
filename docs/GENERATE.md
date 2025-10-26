# Generate Flashcards

The idea is that this will just be a dead simple flashcards web experience. In actuality it'll be more like a slideshow, that simply animates (cross fade) every specified number of seconds. It will display randomized flashcards from a collection as this cross fade slideshow. The display should be responsive with simple large text vertically and horizontally centered on the whole viewport with a solid background color also covering the full viewport. The 1st line of text should be treated like a header, large and bolded and every line below should be a little bit smaller, but definitely legible. There could be up to 3 lines underneath the header line.

# Tech Stack

- Checkout what we already have in place: Biome for lint and syntax correction, Husky for running Biome pre-commit, NPM workspaces, TypeScript 5.
- Next.js 15
- Will deploy to Vercel

# Requirements

- Connect this project to git@github.com:adamhenson/flashcards.git, and git add all files, commit and push as the initial changeset.
- Iterate through all the markdown files in docs/flashcard-collections/* and for each one, create a JSON file that will essentially represent a collection of flashcards. For example, they should adhere a strict data structure like this:
  ```json
  {
    "name": "Fancy Words Generic",
    "items": [
      {
        "main": "Adept (uh-DEPT) – adjective",
        "subs": [
          "Highly skilled or proficient.",
          "a) She’s pretty adept at fixing things around the house without looking it up.",
          "b) He’s adept at picking the perfect restaurant for any mood."
        ]
      }
    ]
  }
  ```
- No preference on CSR or SSG or whatever, and also I'm thinking we may not even need an API. Perhaps you can just import JSON files or ideally dynamically import and then we can do all the randomizing, etc on the frontend.
- Upon landing on the main page (/), the user should be welcomed with some choices to configure a slideshow, think big solid simple text and instruction, like a workfolw UX. This configuration could simply be set as local storage.
  - First, let them choose which collection to use (of all the json files). They should be select by collection "name" (from the json file).
  - Next, let them specify an interval timeframe in seconds.
  - Next, a color theme. This theme simply represents the background color and text (default is black text). Each color should be randomly selected of the chosen palette per flashcard. Allow the user to select a palette (it would be cool to display a large set of swatches) for the user to choose of the following palette sets:
    - #264653 (with white text), #2a9d8f, #8ab17d, #e9c46a, #f4a261, #e76f51
    - #a8e8f9, #00537a, #013c58 (with white text), #f5a201, #ffba42, #ffd35b
    - all with white text: #361c0e, #570211, #7e3110, #004540, #032c4d, #360825,
  - Next, the user should be able to click a "start" button, to start the cross fade slideshow animation (flashcards). It should animate between randomized cards infinitely until the user decides to stop. There should be two fixed buttons for the user to either [pause] or [exit]. Clicking the [exit] button should take the user back to the first screen of configuration. It should still be populated with what they selected before, but allow them to update and start over the same way.
- Update the README.md file on any technical details and what this app is.
- Should be deployable to Vercel

