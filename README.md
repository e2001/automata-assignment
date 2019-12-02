### State Machine - Assignment



This project showcases a stateMachine for producing the remainder when dividing a number by 3

The implementation of the  stateMachine  was design to be flexible using a configuration object , using this configuration object , the user can configure the stateMachine logic to suite their needs, see below for further explanation of the design and features



**Primary code file** 

/src/stateMachine.js  



**Tests** : 

1. The test-state-machine.js file initializes the state machine to the requirement of this assignment ( remainder when dividing a number by 3 )
2. The test-state-machine-options.js file  has some tests that check various configurations and some tests to test the validation of the options object  



**Running the tests** 

to run the 'test' script in package.json , from the main folder run this command : 

```
yarn test
```



**Usage example :** 

the file use-example.js shows a typical usage that outputs the result to the console , from the main folder run this command : 

```
node use-example/use-example.js
```



**Design and assumptions** 

- the state machine is designed to be configured via an option object, supplied at construction time , this configuration can be changed later by calling its loadDefinitions method

- the state machine allows the user flexibility to define transition logic and other aspects

- the stateMachine runs a basic validation on the options object, this validation can be further enhanced depending on requirements 

- the input is a string  ( with no spaces ),  there is an option to specify a delimiter

- emptyInputIsValid:  ( false / true) ,  if true an empty input will be processed using the transition logic,

  if false an empty input will produce 'invalid data'

- for each new call to processInput the state machine starts at the startState

- the stateMachine dose some basic validation on the options object, this validation can be further enhanced depending on requirements  

- as per assignment requirements the stateMachine prints its output,  I addressed this by having it call a output function that is part of the option object , the user can supply a function that will receive the output and preform the printing that is adequate for their platform 





**Options object** 

the options object contains : 

- **states**:  (array of strings) the various states

- **alphabet**:  (an array of strings) ,each string represents an alphabet that can be used in the input string 

- **startState**:  ( string ) the start state

- **delimiter**:  (string)  a delimiter char for input string or an empty string if alphabet is built of single chars

- **finalStateValues**:   Object of { [statename]:'outputvalue' },   defines all final states , and for each final state sets its output value

- **invalidDataErrorStr**:   (string)  the error string to show when input data is invalid,

- **transitionTable**: Object of { [stateFrom] : { [alphabet]:'stateTo'} ,  represents the logic when transitioning from a state to state given an alphabet from the input string 

- **emptyInputIsValid**:  ( false or true) ,  if true an empty input will be processed using the logic in the transitionTable 

- **output** : a function that is called when the stateMachine outputs , it receives the output data to be printed,  this allows the user to specify the output that is adequate for their platform 

- **transition** : a function provided by the user that will preform the transition ,  this keep the transition  logic out of the stateMachine and allows the user full control over the transition logic 

  - Note :  this function can operate without the transitionTable as long as it returns the next state 

    ​             the user is free to write any transition logic  

  - the method is called with the following parameters :

    - currentState : the current state
    - inputAlphabet : the current input Alphabet
    - transitionTable : the transitionTable from the options object

  - the method must return an object representing the next state : 

    ```
    {
        current: current state,
        inputAlphabet : current input alphabet
        error,  (string)  
        nextState: the next state 
    }
    ```
    
    





**example of an options object  ( used for 'remainder when dividing a number by 3 assignment' )** 

```

const transitionTable = {
  'S0': {'0': 'S0', '1': 'S1'},
  'S1': {'0': 'S2', '1': 'S0'},
  'S2': {'0': 'S1', '1': 'S2'}
}

const stateMachineOptions = {

  states: ['S0', 'S1', 'S2'],
  alphabet: ['0', '1'],
  startState: 'S0',
  delimiter: '',
  finalStateValues: {'S0': '0', 'S1': '1', 'S2': '2'},
  invalidDataErrorStr: 'invalid data',
  transitionTable: transitionTable,
  emptyInputIsValid: false,
  output: function (data) {
    console.log(data)
  },
  transition: function (currentState, inputAlphabet, transitionTable) {
    const stateDef = transitionTable[currentState]
    let nextState = undefined
    let error = null
    if (stateDef !== undefined) {
      nextState = stateDef[inputAlphabet]
      if (nextState === undefined) {
        error = 'new state was not found'
      }
    } else {
      error = 'currentState state not found'
    }

    return {
      current: currentState,
      inputAlphabet,
      error,
      nextState
    }
  }
}

   
```









