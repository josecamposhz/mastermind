import React, { useEffect, useState } from "react";
import { Header, Loader, Icon, Button, Message } from "semantic-ui-react";
import SecretCode from "../components/secretCode";
import GameRecords from "../components/GameRecords";
import AttempsCount from "../components/attempsCount";
import { getRandomNumber } from "../callApi";
import { MAX_ATTEMPTS, num } from "../config";
import { addRecord } from "../store";

function compareArrays(arr1, arr2) {
  // convert the arrays to sets
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  let exactMatches = 0;
  let matchesByValue = 0;
  // check if each value in the first array has the same value and position in the second array
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] == arr2[i]) {
      exactMatches++;
    } else if (set1.has(arr2[i])) {
      matchesByValue++;
    }
  }
  // if all checks pass, the arrays are a match
  const result = {
    match: true,
    exactMatches: exactMatches,
    matchesByValue: matchesByValue,
  };
  // setExactMatches(exactMatches);
  // // setEndGame(true);
  // setMatchesByValue(matchesByValue);
  console.log(result);
  return result;
}

// mover a un archivo en la carpeta components
const Counter = ({ count, increment, decrement }) => {
  return (
    <article className="number-wrap">
      <Header as="h1" content={count} />
      <Button.Group icon size="small">
        <Button onClick={decrement} disabled={count <= 0}>
          <Icon name="minus" />
        </Button>
        <Button onClick={increment} disabled={count >= 7}>
          <Icon name="plus" />
        </Button>
      </Button.Group>
    </article>
  );
};
//steps:
//computer pick a random number
//random number gets stored in variable
//User types a number with guessing
// User hits "try"
//Chosen number gets stored in variable
//Numbers are converted into comparable formats
//Numbers are compared
//app identify  similarity and location
//app gives feedback
//lock unlocks if code has been guessed
//TODO: right now the play new game btn stays disabled until player wins. It needs to be possible for player to start a new game at any time
//TODO: Check why each time a number changes before submitting answer the function is executed again - line 60

const DIF = [
  { name: "Facil", value: 4 },
  { name: "Medio", value: 6 },
  { name: "Dificil", value: 8 },
];

const Game = () => {
  const [random, setRandom] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //count can be change for choice because it will be the complete guess
  const [count, setCount] = useState([0, 0, 0, 0]);
  const [records, setRecords] = useState([]);
  const [endGame, setEndGame] = useState(false);
  const [difficult, setDifficult] = useState(DIF[0].value);

  const handleDifficult = (e) => {
    setDifficult(e.target.value);
  };

  const playNewGame = async () => {
    setIsLoading(true);
    const getNewRandom = await getRandomNumber(difficult);
    setRandom(getNewRandom);
    setIsLoading(false);
    setRecords([]);
    setCount(Array.from({ length: difficult }, (_) => 0));
    setEndGame(false);
    setIsLoading(false);
  };

  useEffect(() => {
    playNewGame();
  }, [difficult]);
  // se agrega difficult en el useEffect para capturar los cambios del estado

  const increment = (pos) => {
    // se itera el arreglo y solo se modifica el n??mero de la posici??n recibida como argumento
    // por ejemplo si pos = 2, se deberia modificar solo el tercer el elemento del arreglo
    setCount((count) => count.map((c, index) => (index === pos ? c + 1 : c)));
  };
  const decrement = (pos) => {
    setCount((count) => count.map((c, index) => (index === pos ? c - 1 : c)));
  };

  const submitNumber = () => {
    // validation => exact, etc
    const countToArrOfStr = [...count.join("").split("")];
    const { exactMatches, matchesByValue } = compareArrays(
      countToArrOfStr,
      random
    );
    const record = { value: count, exactMatches, matchesByValue };

    if (exactMatches === random.length) {
      console.log("here");
      addRecord({
        user: "pepito",
        score: 10 - records.length + 1,
        records: [record, ...records],
      });
    }

    setRecords((records) => [record, ...records]);
    console.log("random:", random);
    // const comparison1 = compareArrays(countToArrOfStr, random);
    // console.log(comparison1);
  };

  return (
    <div className="game-container">
      <Header
        as="h4"
        content={
          isLoading ? (
            <>
              <Loader active inline="centered" />
            </>
          ) : (
            `Find out the secret ${num}-digit code. Start playing!`
          )
        }
      />
      <section>
        <select value={difficult} onChange={handleDifficult}>
          {DIF.map((diff) => {
            return <option value={diff.value}>{diff.name}</option>;
          })}
        </select>
      </section>
      <section>
        <SecretCode random={random} />
      </section>
      <section style={{ paddingTop: "5px" }}>
        <AttempsCount attempsLeft={MAX_ATTEMPTS - records.length} />
      </section>
      <div style={{ display: "flex" }} className="user-guesses-container">
        {count.map((c, index) => (
          <Counter
            count={c}
            increment={() => increment(index)}
            decrement={() => decrement(index)}
          />
        ))}
      </div>
      <div className="confirmation-btns">
        <Button
          color="purple"
          onClick={submitNumber}
          disabled={records.length >= MAX_ATTEMPTS || endGame}
        >
          Check Answer
        </Button>
        <Button color="violet" basic onClick={playNewGame}>
          Play New Game
        </Button>
      </div>
      <div>
        {/* {records[records.length - 1] && records[records.length - 1]?.exactMatches === random.length ? (
          <Message floating compact positive content='WOW You are a winner!' />
        ) : (
          <Message content='keep trying' />
        )} */}
      </div>

      <GameRecords records={records} />
    </div>
  );
};

export default Game;
