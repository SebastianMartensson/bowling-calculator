import { Response, Request, NextFunction } from 'express';

type GameProgressionFrames = number[][];

let scoreByFrame: number[] = [];
let totalScore = 0;

export function calculateScore(req: Request, res: Response, next: NextFunction): void {
  try {
    const gameProgressionFrames: GameProgressionFrames = req.body.rolls;
    scoreByFrame = [];
    totalScore = 0;

    for (let frameIndex = 0; frameIndex < gameProgressionFrames.length; frameIndex++) {
      const currentFrame = gameProgressionFrames[frameIndex];
      for (let i = 0; i < currentFrame.length; i++) {
        if (frameIndex === 9) {
          totalScore += lastFrame(currentFrame, frameIndex, gameProgressionFrames);
          scoreByFrame.push(totalScore);
          break;
        }

        if (currentFrame[i] === 10) {
          const strikeScore = strikeBonus(frameIndex, gameProgressionFrames, 0);
          if (strikeScore > 10) {
            totalScore += strikeScore;
            scoreByFrame.push(totalScore);
            continue;
          }else if (strikeScore === 10){
            totalScore += strikeScore;
            scoreByFrame.push(totalScore);
            continue;
          }
        } else if (currentFrame[i] + currentFrame[i + 1] === 10) {
          const spareScore = spareBonus(frameIndex, gameProgressionFrames);
          if (spareScore > 0) {
            totalScore += currentFrame[i] + currentFrame[i + 1] + spareScore;
            scoreByFrame.push(totalScore);
          break;
          }
        } else if (i >= 1) {
          totalScore += currentFrame[0] + currentFrame[1];
          scoreByFrame.push(totalScore);
          continue;
        } else {
          continue;
        }
      }
    }
    res.json(scoreByFrame);
  } catch (error) {
    next(error);
  }
}

function strikeBonus(frameIndex: number, gameProgressionFrames: GameProgressionFrames, lastFrameCounter: number): number {
  let nextFrameIndex = frameIndex + 1;
  let nextFrame = gameProgressionFrames[nextFrameIndex];
  const frame = gameProgressionFrames[frameIndex];

  if (frameIndex === 9) {
    const secondStrike = frame[lastFrameCounter + 1];
    const thirdStrike = frame[lastFrameCounter + 2];
    if (secondStrike && thirdStrike) {
      return frame[lastFrameCounter] + secondStrike + thirdStrike;
    } else if (secondStrike) {
      return frame[lastFrameCounter] + secondStrike;
    } else{
      return frame[lastFrameCounter];
    }
  }

  if (nextFrame && Array.isArray(nextFrame) && frameIndex < 9) {
    if (nextFrame.length === 1) {
      const secondFrameRoll = nextFrame[0];
      nextFrameIndex = frameIndex + 2;
      nextFrame = gameProgressionFrames[nextFrameIndex];
      const thirdFrameRoll = nextFrame && frameIndex !== 7 ? nextFrame[0] : 0;
      return frame[lastFrameCounter] + secondFrameRoll + thirdFrameRoll;
    } else if (nextFrame.length === 2) {
      const nextRoll = nextFrame[0];
      const secondNextRoll = nextFrame[1];
      return frame[lastFrameCounter] + nextRoll + secondNextRoll;
    }else if (frameIndex === 8){
      return frame[lastFrameCounter];
    }
  }

  return 0;
}

function spareBonus(frameIndex: number, gameProgressionFrames: GameProgressionFrames): number {
  let nextFrameIndex = frameIndex + 1;
  let nextFrame = gameProgressionFrames[nextFrameIndex];
  if (frameIndex === 9) {
    const frame = gameProgressionFrames[frameIndex];
    if (frame.length === 3) {
      return frame[2];
    }
  }

  if (nextFrame && Array.isArray(nextFrame) && frameIndex < 9) {
    const nextRoll = nextFrame[0];
    return nextRoll;
  }

  return 0;
}

function lastFrame(currentFrame: number[], frameIndex: number, gameProgressionFrames: GameProgressionFrames): number {
  let bonus = false;
  let lastFrameScore = 0;
  for (let i = 0; i < currentFrame.length; i++) {
    if (currentFrame[i] === 10) {
      const strikeScore = strikeBonus(frameIndex, gameProgressionFrames, i);
      if (strikeScore > 0) {
        lastFrameScore += strikeScore;
        bonus = true;
      }
      continue;
    } else if (currentFrame[i] + currentFrame[i + 1] === 10 && i < 1) {
      const spareScore = currentFrame[i] + currentFrame[i + 1] + spareBonus(frameIndex, gameProgressionFrames);
      if (spareScore > 0) {
        lastFrameScore += spareScore;
        bonus = true;
      }
      continue;
    } else if (i === 1 && !bonus) {
      totalScore += currentFrame[0] + currentFrame[1];
      scoreByFrame.push(totalScore);
      continue;
    } else if (i === 2 && bonus) {
      lastFrameScore += currentFrame[2];
    }
  }
  return lastFrameScore;
}

export function resetGame(): void {
  scoreByFrame = [];
  totalScore = 0;
}