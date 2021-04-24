import { merge } from "../utils";

/**
 * Function signature of the function used to derive a new state from
 */
interface IDerivedStateFn<IState extends object> {
  /**
   * @param {IState | {}} oldState The previous state
   *
   * @returns {Partial<IState>} The new state
   */
  (oldState: IState | {}): Partial<IState>;
}

/**
 * An abstract class with state management functions
 */
export abstract class StatefulClass<IState extends object = {}> {
  /**
   * The initial state (that was passed to us in the constructor)
   *
   * Used to reset the `state` field.
   */
  private initialState: IState | {};

  /**
   * The state
   *
   * Holds data for that particular class instance.
   */
  protected state: IState | {};

  /**
   * Constructor of `StatefulClass`
   *
   * @param {IState | {}} state The initial state to use
   *
   * Defaults to an empty object
   * 
   * **Important Note:** Currently, passing an initial state doesn't 
   * work for some reason...
   * 
   * @todo Make passing an initial state work.
   */
  constructor(state: IState | {} = {}) {
    // the initial state is given to us (or defaults to an empty object)
    // use that to initialize the state
    this.state = {};
    merge(this.state, state, {
      createNewObject: true,
    });
    // store a copy of the initial state, just in case we want to reset the
    // state back to default...
    this.initialState = {};
    merge(this.initialState, state, {
      createNewObject: true,
    });
  }

  /**
   * Updates the `state` field by deeply-merging the `state` field `newState`
   *
   * @param {Partial<IState> | IDerivedStateFn} newState The state object to
   * merge / a function to derive the new state.
   *
   * @returns {void}
   */
  protected setState(newState: Partial<IState>): void;
  protected setState(newState: IDerivedStateFn<IState>): void;

  protected setState(newState: Partial<IState> | IDerivedStateFn<IState>) {
    // if `newState` is a function...
    if (newState instanceof Function) {
      // ... then pass `this.state` to the `newState` function to derive the
      // new state and merge them
      merge(this.state, newState(this.state), {
        createNewObject: true,
      });
    } else {
      // ... otherwise, merge `this.state` and `newState` directly
      merge(this.state, newState, {
        createNewObject: true,
      });
    }
  }

  /**
   * Resets the `state` field to the initial state that was provided to us.
   *
   * @returns {void}
   */
  protected resetState(): void {
    // create a copy of the initial state (the one that was passed to us in the
    // constructor...)
    const initialStateCopy = {};
    merge(initialStateCopy, this.initialState, {
      createNewObject: true,
    });

    // reset the state
    this.state = initialStateCopy;
  }
}
