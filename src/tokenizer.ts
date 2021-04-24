import { StatefulClass } from "./helpers/StatefulClass";
import { isInRange } from "./utils/isInRange";

/**
 * The `Tokenizer`'s state
 */
interface ITokenizerState {
  /**
   * The input text (passed to us in the constructor)
   *
   * @readonly
   */
  readonly input: string;

  /**
   * `Tokenizer`'s buffer
   */
  buffer: string[];

  /**
   * The array containing the output tokens
   */
  tokens: string[];
}

/**
 * Helps in tokenizing the given text input
 */
export class Tokenizer extends StatefulClass<ITokenizerState> {
  // initialize the state
  protected state: ITokenizerState = { ...super.state } as ITokenizerState;

  /**
   * Constructor of `Tokenizer`
   * 
   * @param {string} input The input string to tokenize
   */
  constructor(input: string) {
    // initial state (used when resetting the state)
    super({
      buffer: [],
      input,
      tokens: [],
    });

    // set the state to:
    // 1. the given input, and
    // 2. empty arrays for `tokens` and `buffers` properties respectively
    this.setState({
      buffer: [],
      input,
      tokens: [],
    });
  }

  /**
   * Performs tokenization and returns the output.
   * 
   * @returns {string} The output upon tokenization
   */
  get tokens(): string[] {
    // don't run `this.tokenize()` if `this.state.tokens` is already set
    if (
      !this.state.tokens ||
      (this.state.tokens && !this.state.tokens.length)
    ) {
      this.tokenize();
    }

    return this.state.tokens;
  }

  /**
   * Resets the current `Tokenizer` state and sets the input text to the given
   * input text.
   *
   * @param {string} input The new input text
   *
   * @returns {void}
   */
  changeInput(input: string): void {
    // reset the state...
    this.resetState();
    // ... and change the input text
    this.setState({
      input,
    });
  }

  /**
   * Checks if the given character is a punctuation character.
   *
   * (Uses character ranges as specified in
   * https://github.github.com/gfm/#ascii-punctuation-character)
   *
   * @param {string} character The character to run the tests on
   *
   * @returns {boolean} `true` if the given character is an ASCII punctuation
   * character; `false` otherwise
   */
  protected isAsciiPunctuationCharacter(character: string): boolean {
    // if `character`s length is 0 or > 1...
    if (!character.length || character.length > 1) {
      // ... then throw a `RangeError`
      throw new RangeError(
        `Expected 'character' to be of length 1, received ${character}`
      );
    }

    // get the code point of the character
    const charCodePoint = character.codePointAt(0);
    // extract the options for `isInRange` in its own variable to prevent
    // redundancy
    const rangeOptions = {
      top: true,
      bottom: true,
    };

    // perform the range checks on the code point
    if (
      charCodePoint &&
      (isInRange(charCodePoint, 33, 47, rangeOptions) ||
        isInRange(charCodePoint, 58, 64, rangeOptions) ||
        isInRange(charCodePoint, 91, 96, rangeOptions) ||
        isInRange(charCodePoint, 123, 126, rangeOptions))
    ) {
      // the character *is* a punctuation character!!
      return true;
    }

    return false;
  }

  /**
   * Checks if the given character is a Unicode whitespace character and
   * returns its type if it is.
   *
   * (Uses character ranges as specified in
   * https://github.github.com/gfm/#whitespace-character)
   *
   * @param {string} character The character to run the tests on
   *
   * @returns {boolean} `true` if the given character is a whitespace
   * character; `false` otherwise
   */
  protected isWhitespaceCharacter(character: string): boolean {
    // if `character`s length is 0 or > 1...
    if (!character.length || character.length > 1) {
      // ... then throw a `RangeError`
      throw new RangeError(
        `Expected 'character' to be of length 1, received ${character}`
      );
    }

    // get the code point of the character
    const charCodePoint = character.codePointAt(0);

    if (
      charCodePoint &&
      (charCodePoint === 32 || isInRange(charCodePoint, 9, 13))
    ) {
      // the character *is* a whitespace character!!
      return true;
    }

    return false;
  }

  /**
   * Joins each character in `state.buffer` and 'empties' it.
   *
   * @param {string} separator The separator to join with
   *
   * Default: none
   *
   * @returns {string} The joined string if the buffer isn't empty; an empty
   * string otherwise
   */
  private joinBuffer(separator: string = ``): string {
    if (this.state.buffer.length) {
      const joinedValue: string = this.state.buffer.join(separator);
      this.state.buffer = [];

      return joinedValue;
    }

    return "";
  }

  /**
   * Tokenizes the text input (in `this.state.input`) and stores the output in
   * `this.state.tokens`.
   *
   * @returns {void}
   */
  private tokenize(): void {
    // break the input text into individual characters
    const characters = [...this.state.input];

    // iterate through the `characters` array
    for (const character of characters) {
      // is the current character a punctuation character?
      const isPunctuation = this.isAsciiPunctuationCharacter(character);
      // is the current character a whitespace character?
      const isWhitespace = this.isWhitespaceCharacter(character);

      // if the character is a punctuation or a whitespace character...
      if (isWhitespace || isPunctuation) {
        // ... then join the buffer and push its value to the output array if
        // its not empty
        const bufferValue = this.joinBuffer();
        if (bufferValue) {
          this.setState({
            tokens: [bufferValue],
          });
        }

        // push the current character to the output array
        this.setState({
          tokens: [character],
        });
      } else {
        // ... otherwise, push the character to the buffer
        this.setState({
          buffer: [character],
        });
      }
    }

    // join the remaining items in the buffer and push them to the output array
    // if `bufferValue` isn't empty
    const bufferValue = this.joinBuffer();
    if (bufferValue) {
      this.setState({
        tokens: [bufferValue],
      });
    }
  }
}
