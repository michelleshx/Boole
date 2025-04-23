import * as monaco from "monaco-editor";

import { OnMount } from "@monaco-editor/react";
import { ruleDefinitions } from "./rules";

/**
 * Registers the George language with Monaco editor and sets up syntax highlighting and completion suggestions.
 */
export const registerGeorge: OnMount = (editor, monaco) => {
  // Register the george language
  monaco.languages.register({ id: "george" });

  // Set language configuration for auto-closing brackets
  monaco.languages.setLanguageConfiguration("george", {
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "(", close: ")" },
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "(", close: ")" },
    ],
    indentationRules: {
      increaseIndentPattern: /{$/,
      decreaseIndentPattern: /^}/,
    },
    brackets: [
      ["{", "}"], // Only define curly braces as brackets
    ],
    onEnterRules: [
      {
        // Match lines that start with a number followed by ")"
        beforeText: /^\s*(\d+)\).*$/,
        action: {
          indentAction: monaco.languages.IndentAction.None,
          appendText: "\n",
          removeText: 0,
        },
      },
    ],
    comments: {
      lineComment: "//",
    },
  });

  // Define syntax highlighting rules
  monaco.languages.setMonarchTokensProvider("george", {
    tokenizer: {
      root: [
        // Comments - must be before other rules
        [/\/\/.*$/, "comment"],

        // Entire lines starting with # should be colored
        [
          /^.*#(?:check\s+(?:PROP|ND|PC|Z|TP|ST|PREDTYPES|PRED|CE|FALSE|CONSISTENT|SAT|EVALUATE|NONE)|[qua][ \t].*$)/,
          "constant.other",
        ],

        // Line numbers - must be before regular numbers
        [/^\s*(?:\d+|bc|ih)\)/, "variable.language"],

        // Numbers in references (after 'on') should be colored like line numbers
        [
          /\bon\s+((?:\d+|bc|ih)(?:\s*[,-]\s*(?:\d+|bc|ih))*)/g,
          "variable.language",
        ],

        // All other numbers in expressions should be white (including those in brackets)
        // except when they're part of an identifier or line number
        [/(?<![a-zA-Z])\d+(?![a-zA-Z])/, { token: "" }],

        // Keywords
        [
          /\b(by|on|forall|exists|schema|pred|end|proc|fun|assert|if|then|else|while|do)\b/,
          "keyword",
        ],

        // Built-in constants
        [/\b(true|false|empty|univ|N)\b/, "string"],

        // Language constants (proof rules)
        [
          /\b(and_i|and_e|or_i|or_e|lem|imp_e|not_e|not_not_i|not_not_e|iff_i|iff_e|trans|iff_mp|exists_i|forall_e|eq_i|eq_e|premise|raa|cases|imp_i|forall_i|exists_e|disprove|case|assume|for every|for some|and_nb|not_and_br|or_br|not_or_nb|imp_br|not_imp_nb|not_not_nb|iff_br|not_iff_br|forall_nb|not_forall_nb|exists_nb|not_exists_nb|closed|comm_assoc|contr|lem|impl|contrapos|simp1|simp2|distr|dm|neg|equiv|idemp|forall_over_and|exists_over_or|swap_vars|move_exists|move_forall|set|arith|Delta|Xi)\b/,
          "constant.language",
        ],

        // Operators
        [
          /\b(in|sube|sub|pow|union|inter|card|gen_U|dom|ran|id|iter|seq|compl)\b/,
          "constant.numeric",
        ],

        // Special symbols
        [/[&()+:;=\|\-<>?!*]|diff|prod/, "constant.numeric"],

        // Identifiers with numbers - must be before standalone numbers
        [/[a-zA-Z_]\w*/, "identifier"],

        // Standalone numbers - moved to end
        [/\b\d+\b/, "variable.language"],
      ],
    },
  });

  // Register completions - fixed type signature
  monaco.languages.registerCompletionItemProvider("george", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        // Checks
        {
          label: "check ND",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check ND",
          range,
        },
        {
          label: "check TP",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check TP",
          range,
        },
        {
          label: "check ST",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check ST",
          range,
        },
        {
          label: "check PREDTYPES",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check PREDTYPES",
          range,
        },
        {
          label: "check PROP",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check PROP",
          range,
        },
        {
          label: "check Z",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check Z",
          range,
        },
        {
          label: "check PC",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check PC",
          range,
        },
        {
          label: "check NONE",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check NONE",
          range,
        },
        {
          label: "check CE",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check CE",
          range,
        },
        {
          label: "check FALSE",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check FALSE",
          range,
        },
        {
          label: "check CONSISTENT",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check CONSISTENT",
          range,
        },
        {
          label: "check SAT",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check SAT",
          range,
        },
        {
          label: "check EVALUATE",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "check EVALUATE",
          range,
        },

        // Keywords
        {
          label: "false",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "false",
          range,
        },
        {
          label: "true",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "true",
          range,
        },

        // Natural deduction rules
        {
          label: "and_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "and_i",
          range,
        },
        {
          label: "and_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "and_e",
          range,
        },
        {
          label: "or_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "or_i",
          range,
        },
        {
          label: "or_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "or_e",
          range,
        },
        {
          label: "imp_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "imp_e",
          range,
        },
        {
          label: "imp_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "imp_i",
          range,
        },
        {
          label: "not_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_e",
          range,
        },
        {
          label: "not_not_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_not_i",
          range,
        },
        {
          label: "not_not_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_not_e",
          range,
        },
        {
          label: "iff_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "iff_i",
          range,
        },
        {
          label: "iff_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "iff_e",
          range,
        },
        {
          label: "iff_mp",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "iff_mp",
          range,
        },
        {
          label: "exists_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "exists_i",
          range,
        },
        {
          label: "exists_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "exists_e",
          range,
        },
        {
          label: "forall_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "forall_i",
          range,
        },
        {
          label: "forall_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "forall_e",
          range,
        },
        {
          label: "eq_i",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "eq_i",
          range,
        },
        {
          label: "eq_e",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "eq_e",
          range,
        },
        {
          label: "premise",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "premise",
          range,
        },
        {
          label: "raa",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "raa",
          range,
        },
        {
          label: "cases",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "cases",
          range,
        },
        {
          label: "case",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "case",
          range,
        },
        {
          label: "assume",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "assume",
          range,
        },
        {
          label: "disprove",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "disprove",
          range,
        },

        // Semantic tableaux rules
        {
          label: "and_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "and_nb",
          range,
        },
        {
          label: "not_and_br",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_and_br",
          range,
        },
        {
          label: "or_br",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "or_br",
          range,
        },
        {
          label: "not_or_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_or_nb",
          range,
        },
        {
          label: "imp_br",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "imp_br",
          range,
        },
        {
          label: "not_imp_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_imp_nb",
          range,
        },
        {
          label: "not_not_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_not_nb",
          range,
        },
        {
          label: "iff_br",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "iff_br",
          range,
        },
        {
          label: "not_iff_br",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_iff_br",
          range,
        },
        {
          label: "forall_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "forall_nb",
          range,
        },
        {
          label: "not_forall_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_forall_nb",
          range,
        },
        {
          label: "exists_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "exists_nb",
          range,
        },
        {
          label: "not_exists_nb",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "not_exists_nb",
          range,
        },

        // Transformational rules
        {
          label: "comm_assoc",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "comm_assoc",
          range,
        },
        {
          label: "contr",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "contr",
          range,
        },
        {
          label: "lem",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "lem",
          range,
        },
        {
          label: "impl",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "impl",
          range,
        },
        {
          label: "contrapos",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "contrapos",
          range,
        },
        {
          label: "simp1",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "simp1",
          range,
        },
        {
          label: "simp2",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "simp2",
          range,
        },
        {
          label: "distr",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "distr",
          range,
        },
        {
          label: "dm",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "dm",
          range,
        },
        {
          label: "neg",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "neg",
          range,
        },
        {
          label: "equiv",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "equiv",
          range,
        },
        {
          label: "idemp",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "idemp",
          range,
        },
        {
          label: "forall_over_and",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "forall_over_and",
          range,
        },
        {
          label: "exists_over_or",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "exists_over_or",
          range,
        },
        {
          label: "swap_vars",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "swap_vars",
          range,
        },
        {
          label: "move_exists",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "move_exists",
          range,
        },
        {
          label: "move_forall",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "move_forall",
          range,
        },

        // Set operations
        {
          label: "card()",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "card()",
          range,
        },
        {
          label: "pow()",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "pow()",
          range,
        },
        {
          label: "dom()",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "dom()",
          range,
        },
        {
          label: "ran()",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "ran()",
          range,
        },

        // Set operators
        {
          label: "in",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "in",
          range,
        },
        {
          label: "sube",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "sube",
          range,
        },
        {
          label: "sub",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "sub",
          range,
        },
        {
          label: "union",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "union",
          range,
        },
        {
          label: "inter",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "inter",
          range,
        },
        {
          label: "gen_U",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "gen_U",
          range,
        },
        {
          label: "id",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "id",
          range,
        },
        {
          label: "iter",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "iter",
          range,
        },
        {
          label: "seq",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "seq",
          range,
        },

        // Built-in constants
        {
          label: "empty",
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: "empty",
          range,
        },
        {
          label: "univ",
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: "univ",
          range,
        },
        {
          label: "N",
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: "N",
          range,
        },
        {
          label: "compl",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "compl",
          range,
        },
        {
          label: "diff",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "diff",
          range,
        },
        {
          label: "prod",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "prod",
          range,
        },
        {
          label: "trans",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "trans",
          range,
        },
        {
          label: "for every",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "for every",
          range,
        },
        {
          label: "for some",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "for some",
          range,
        },
        {
          label: "closed",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "closed",
          range,
        },
        {
          label: "set",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "set",
          range,
        },
        {
          label: "arith",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "arith",
          range,
        },
        {
          label: "Delta",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "Delta",
          range,
        },
        {
          label: "Xi",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "Xi",
          range,
        },
      ];

      return { suggestions };
    },
  });

  // Add definition provider before theme definition
  monaco.languages.registerDefinitionProvider("george", {
    provideDefinition: (model, position) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const cursorPosition = position.column; // Monaco's column is 1-based

      // Match "on" followed by references, stopping at "by" or end of line
      const onMatch = /\bon\s+(.*?)(?=\s*(?:by|$))/i.exec(lineContent);
      if (onMatch) {
        const referencesStr = onMatch[1]; // The references string
        const referencesStartIndex =
          onMatch.index + onMatch[0].indexOf(referencesStr);

        let currentIndex = 0;
        const refs = referencesStr.split(",");
        for (const ref of refs) {
          const refWithWhitespace = ref;
          const trimmedRef = ref.trim();
          const refIndexInReferencesStr = referencesStr.indexOf(
            refWithWhitespace,
            currentIndex
          );
          currentIndex = refIndexInReferencesStr + refWithWhitespace.length;

          const matchStartIndex =
            referencesStartIndex +
            refIndexInReferencesStr +
            refWithWhitespace.indexOf(trimmedRef);
          const matchLength = trimmedRef.length;

          const startColumn = matchStartIndex + 1; // Convert to 1-based column number
          const endColumn = startColumn + matchLength - 1;

          // Adjusted condition to include position directly after the number
          if (
            cursorPosition >= startColumn &&
            cursorPosition <= endColumn + 1
          ) {
            if (trimmedRef.includes("-")) {
              const [startRef, endRef] = trimmedRef.split("-");
              const dashIndexInRef = trimmedRef.indexOf("-");
              const startRefLength = dashIndexInRef;
              const endRefLength = trimmedRef.length - dashIndexInRef - 1;

              const startRefStartColumn = startColumn;
              const startRefEndColumn = startColumn + startRefLength - 1;
              const endRefStartColumn = startRefEndColumn + 2; // Skip the dash
              const endRefEndColumn = endColumn;

              // Adjusted conditions for ranges
              if (
                cursorPosition >= startRefStartColumn &&
                cursorPosition <= startRefEndColumn + 1
              ) {
                return findLineDefinition(
                  model,
                  startRef.trim(),
                  position.lineNumber
                );
              } else if (
                cursorPosition >= endRefStartColumn &&
                cursorPosition <= endRefEndColumn + 1
              ) {
                return findLineDefinition(
                  model,
                  endRef.trim(),
                  position.lineNumber
                );
              }
            } else {
              // Single reference
              return findLineDefinition(model, trimmedRef, position.lineNumber);
            }
          }
        }
      }

      return null;
    },
  });

  /**
   * Finds the definition of a line reference within the current proof section.
   * A proof section is delimited by #q, #u, #a or #check markers.
   * Returns the range of the referenced line if found, null otherwise.
   *
   * @param model - The Monaco editor model
   * @param lineRef - The line reference to find (e.g. "1", "bc", "ih")
   * @param currentLineNumber - The line number where the reference appears
   */
  function findLineDefinition(
    model: monaco.editor.ITextModel,
    lineRef: string,
    currentLineNumber: number
  ) {
    // Find section boundaries
    let sectionStart = 1;
    let sectionEnd = model.getLineCount();

    // Search backwards for section start
    for (let i = currentLineNumber; i >= 1; i--) {
      const line = model.getLineContent(i);
      if (line.match(/^(?:\s*)#[qua]/) || line.match(/^(?:\s*)#check/)) {
        sectionStart = i;
        break;
      }
    }

    // Search forwards for section end
    for (let i = currentLineNumber; i <= model.getLineCount(); i++) {
      const line = model.getLineContent(i);
      if (
        i > currentLineNumber &&
        (line.match(/^(?:\s*)#[qua]/) || line.match(/^(?:\s*)#check/))
      ) {
        sectionEnd = i;
        break;
      }
    }

    // Search for the line reference within current section
    for (let i = sectionStart; i < sectionEnd; i++) {
      const line = model.getLineContent(i);
      const match = line.match(new RegExp(`^\\s*${lineRef}\\)`));
      if (match) {
        return {
          uri: model.uri,
          range: {
            startLineNumber: i,
            startColumn: 1,
            endLineNumber: i,
            endColumn: line.length + 1,
          },
        };
      }
    }
    return null;
  }

  /**
   * Updates line number references in proof steps when lines are added or removed.
   * Handles both individual numbers and ranges in 'on' statements.
   *
   * @param model - The Monaco editor model
   * @param content - The line content to update references in
   * @param startNumber - The line number to start updating references from
   * @param increment - Whether to increment (true) or decrement (false) the references
   * @param currentLineNumber - The current line number in the editor
   * @returns The updated content with adjusted line references
   */
  const updateReferences = (
    model: monaco.editor.ITextModel,
    content: string,
    startNumber: number,
    increment: boolean,
    currentLineNumber: number
  ) => {
    // Find the current proof section boundaries
    let sectionStart = 1;
    let sectionEnd = model.getLineCount();

    // Search backwards for section start (#q, #u, #a or #check)
    for (let i = currentLineNumber; i >= 1; i--) {
      const line = model.getLineContent(i);
      if (line.match(/^(?:\s*)#[qua]/) || line.match(/^(?:\s*)#check/)) {
        sectionStart = i;
        break;
      }
    }

    // Search forwards for section end (next #q, #u, #a or #check)
    for (let i = currentLineNumber; i <= model.getLineCount(); i++) {
      const line = model.getLineContent(i);
      if (line.match(/^(?:\s*)#[qua]/) || line.match(/^(?:\s*)#check/)) {
        sectionEnd = i;
        break;
      }
    }

    // Update line references in 'on' statements, handling both individual numbers and ranges
    return content.replace(
      /\bon\s+((?:\d+(?:\s*[,-]\s*\d+)*)|(?:bc|ih))/g,
      (match, numbers) => {
        // Split references by commas
        const parts = numbers.split(/\s*,\s*/);
        const updatedParts = parts.map((part: string) => {
          // Handle ranges (e.g. "1-3")
          if (part.includes("-")) {
            const [start, end] = part.split(/\s*-\s*/);
            const startNum = parseInt(start);
            const endNum = parseInt(end);

            if (!isNaN(startNum) && !isNaN(endNum)) {
              // Update range bounds if they're >= startNumber
              const newStart =
                startNum >= startNumber
                  ? increment
                    ? startNum + 1
                    : startNum - 1
                  : startNum;
              const newEnd =
                endNum >= startNumber
                  ? increment
                    ? endNum + 1
                    : endNum - 1
                  : endNum;
              return `${newStart}-${newEnd}`;
            }
          } else {
            // Handle single numbers
            const num = parseInt(part);
            if (!isNaN(num) && num >= startNumber) {
              return increment ? num + 1 : num - 1;
            }
          }
          // Return unchanged if not a number or below startNumber
          return part;
        });

        return `on ${updatedParts.join(", ")}`;
      }
    );
  };

  // Handle keyboard events in the editor
  editor.onKeyDown((e) => {
    const model = editor.getModel();
    if (!model) return;

    const position = editor.getPosition();
    if (!position) return;

    // Handle Enter key press
    if (e.keyCode === monaco.KeyCode.Enter) {
      const lineContent = model.getLineContent(position.lineNumber);

      // Handle auto-indentation when cursor is between empty braces {}
      if (
        lineContent.trim().endsWith("{}") &&
        position.column === lineContent.indexOf("}") + 1
      ) {
        e.preventDefault();
        const currentIndent = lineContent.match(/^\s*/)?.[0] || "";
        const additionalIndent = "\t"; // Tab for nested indent

        // Insert new line with proper indentation and an extra line after
        const operations = [
          {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text:
              "\n" + currentIndent + additionalIndent + "\n" + currentIndent,
          },
        ];

        model.pushEditOperations([], operations, () => null);

        // Position cursor on the indented line
        editor.setPosition({
          lineNumber: position.lineNumber + 1,
          column: (currentIndent + additionalIndent).length + 1,
        });
        return;
      }

      // Handle empty line numbers (e.g., "1) ")
      const emptyMatch = lineContent.match(/^\s*(\d+)\)\s*$/);
      if (emptyMatch) {
        e.preventDefault();
        const currentIndent = lineContent.match(/^\s*/)?.[0] || "";

        // Remove the line number, leaving just indentation
        const operations = [
          {
            range: new monaco.Range(
              position.lineNumber,
              1,
              position.lineNumber,
              lineContent.length + 1
            ),
            text: currentIndent,
          },
        ];

        model.pushEditOperations([], operations, () => null);
        editor.setPosition({
          lineNumber: position.lineNumber,
          column: currentIndent.length + 1,
        });
        return;
      }

      // Handle numbered lines (e.g., "1) some content")
      const match = lineContent.match(/^\s*(\d+)\)/);
      if (match) {
        e.preventDefault();
        const currentNumber = parseInt(match[1]);
        const currentIndent = lineContent.match(/^\s*/)?.[0] || "";

        // Find section boundaries marked by #q, #u, #a, or #check
        let sectionStart = 1;
        let sectionEnd = model.getLineCount();

        // Search backwards for the nearest boundary
        for (let i = position.lineNumber; i >= 1; i--) {
          const line = model.getLineContent(i);
          if (line.match(/^(?:\s*)#[qua]/) || line.match(/^(?:\s*)#check/)) {
            sectionStart = i;
            break;
          }
        }

        // Search forwards for the next boundary
        for (let i = position.lineNumber; i <= model.getLineCount(); i++) {
          const line = model.getLineContent(i);
          if (line.match(/^(?:\s*)#[qua]/) || line.match(/^(?:\s*)#check/)) {
            sectionEnd = i;
            break;
          }
        }

        // Find all sequential numbered lines that follow the current line
        const followingLines = [];
        let expectedNumber = currentNumber + 1;
        for (let i = position.lineNumber + 1; i <= sectionEnd; i++) {
          const line = model.getLineContent(i);
          const numMatch = line.match(/^\s*(\d+)\)/);
          if (numMatch) {
            const lineNum = parseInt(numMatch[1]);
            if (lineNum !== expectedNumber) break;
            followingLines.push({
              lineNumber: i,
              number: lineNum,
              content: line,
              indent: line.match(/^\s*/)?.[0] || "",
            });
            expectedNumber++;
          }
        }

        // Insert new line with incremented number and update following lines
        const newNumber = currentNumber + 1;
        const newLine = `${currentIndent}${newNumber}) `;

        const operations = [
          {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text: "\n" + newLine,
          },
          // Update line numbers and references in all following lines
          ...followingLines.map((line) => {
            const updatedContent = updateReferences(
              model,
              line.content,
              currentNumber + 1,
              true,
              line.lineNumber
            );
            return {
              range: new monaco.Range(
                line.lineNumber,
                1,
                line.lineNumber,
                line.content.length + 1
              ),
              text: updatedContent.replace(
                /^\s*\d+\)/,
                `${line.indent}${line.number + 1})`
              ),
            };
          }),
        ];

        model.pushEditOperations([], operations, () => null);
        editor.setPosition({
          lineNumber: position.lineNumber + 1,
          column: newLine.length + 1,
        });
      }
    }
  });

  // Register hover provider for rule definitions
  monaco.languages.registerHoverProvider("george", {
    provideHover: (model, position) => {
      const wordInfo = model.getWordAtPosition(position);
      if (!wordInfo) return null;

      // Check if word is a defined rule and show its definition
      const ruleDef = ruleDefinitions[wordInfo.word];
      if (ruleDef) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            wordInfo.startColumn,
            position.lineNumber,
            wordInfo.endColumn
          ),
          contents: [
            { value: `**${wordInfo.word}** (${ruleDef.category})` },
            { value: ruleDef.definition },
          ],
        };
      }

      return null;
    },
  });
};
