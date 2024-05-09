# battleship-engine
A stand-alone engine for running Battleship-style games on a hexagonal game board. Does not have a built-in interface; all interaction in this repo is done through tests.

## 🚧 Currently in development 🚧

## I built a 3D interface for this engine!

Check it out at https://github.com/itspladd/shootyboats!

## Overview

This module exposes a GameEngine class and several objects representing constant values for the game. An instantiated GameEngine object can receive moves through its promise-based inputMove function. When the move has been fully validated and processed, the promise resolves with information about the move's success or failure and the entire current state of the game.

## Installation

To use this engine in another project, run `npm install @itspladd/battleship-engine`.

To run this project locally, you'll need a standard Node.js installation.

1. Clone the repository
2. Run `npm install`
3. Run `npm run tests` to confirm that the installation is working properly
