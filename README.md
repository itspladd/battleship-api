# battleship-engine
A stand-alone engine for running Battleship-style games on a hexagonal game board. Currently lacking an interface; all interaction is done through tests.

## 🚧 Currently in development 🚧

## Overview

This module exposes a GameEngine class and several objects representing constant values for the game. An instantiated GameEngine object can receive moves through its promise-based inputMove function. When the move has been fully validated and processed, the promise resolves with information about the move's success or failure and the entire current state of the game.

## Install

`npm install @itspladd/battleship-engine`