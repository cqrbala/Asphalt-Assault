# Game Setup

Head to the directory that you want to setup your game in and run the following commands:

```
npm init vite
// Type in your game name, select Vanilla as the framework
// and Javascript as the variant

cd {game name}
npm install
npm install three
```

Now replace your index.html, style.css and main.js files with those provided in this repository. Also place the other folders and files provided as well.

Run `npm run dev` and click on the local host link which appears, to get to the game.

# Features of the Game

### Movement of the User Car

- W / Arrow UP - Accelerate
- S / Arrow DOWN - Decelerate
- A / Arrow LEFT - Turn left
- D / Arrow RIGHT - Turn right

### Fuel Cans

Collect fuel cans, which are spawned randomly on the track, to refill your fuel tank.

If your fuel tanks becomes empty, the game is over.

### Collisions

Avoid bumping into other cars & being hit by other cars as it reduces your health. 

If your health hits zero, the game is over.

# Winning Conditions

- At the beginning of the game, three opponent cars are spawned randomly and they race alongside the user car as well.
- At the end of the game, a leaderboard is displayed to show the user’s rank among all the other cars.

This is done based on the “score” of the player, which at any point shows the number of laps covered so far.

So to win, try to get as many laps as you can before your health becomes zero or you run out of fuel !
