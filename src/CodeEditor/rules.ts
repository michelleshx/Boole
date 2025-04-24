  interface RuleDefinition {
    category: string;
    definition: string;
  }

  export const ruleDefinitions: Record<string, RuleDefinition> = {
    // Propositional Logic - Natural Deduction
    premise: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Premise: State a given assumption or hypothesis",
    },
    and_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Conjunction Introduction: From P and Q, derive P & Q",
    },
    and_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Conjunction Elimination: From P & Q, derive P or Q",
    },
    or_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Disjunction Introduction: From P, derive P | Q (or from Q, derive P | Q)",
    },
    or_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Disjunction Elimination: From P | Q and both P ⊢ R and Q ⊢ R, derive R",
    },
    imp_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Implication Introduction: If assuming P derives Q, then derive P => Q",
    },
    imp_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Implication Elimination: From P and P => Q, derive Q (Modus Ponens)",
    },
    not_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Negation Elimination: From P and !P, derive any conclusion",
    },
    not_not_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Double Negation Introduction: From P, derive !!P",
    },
    not_not_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Double Negation Elimination: From !!P, derive P",
    },
    iff_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Biconditional Introduction: From P => Q and Q => P, derive P <=> Q",
    },
    iff_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Biconditional Elimination: From P <=> Q, derive P => Q and Q => P",
    },
    iff_mp: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Biconditional Modus Ponens: From P <=> Q and P, derive Q (or from Q, derive P)",
    },
    raa: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Reductio Ad Absurdum: If assuming !P leads to a contradiction, derive P",
    },
    cases: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Proof by Cases: If P | Q and both P ⊢ R and Q ⊢ R, then derive R",
    },
    case: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Case Analysis: Used within a proof by cases to start each case",
    },
    assume: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Assumption: Temporarily assume a formula for a sub-proof",
    },
    disprove: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Disprove: Begin a proof by contradiction to disprove a statement",
    },

    // Predicate Logic - Natural Deduction
    forall_i: {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Universal Introduction: If P(x) is proven for arbitrary x, derive  forall x. P(x)",
    },
    forall_e: {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Universal Elimination: From forall x. P(x), derive P[t/x] for any term t",
    },
    exists_i: {
      category: "Predicate Logic (Natural Deduction)",
      definition: "Existential Introduction: From P[t/x], derive exists x. P(x)",
    },
    exists_e: {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Existential Elimination: From exists x. P(x), assume P(c) for fresh c to derive conclusion",
    },
    "for every": {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Universal Instantiation Block: Begin a block to reason about a genuine value",
    },
    "for some": {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Existential Instantiation Block: Begin a block to reason about a witness",
    },

    // Semantic Tableaux Rules
    and_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching And: From P & Q, derive both P and Q",
    },
    not_and_br: {
      category: "Semantic Tableaux",
      definition: "Branching Not-And: From !(P & Q), branch into !P and !Q",
    },
    or_br: {
      category: "Semantic Tableaux",
      definition: "Branching Or: From P | Q, branch into P and Q",
    },
    not_or_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching Not-Or: From !(P | Q), derive both !P and !Q",
    },
    imp_br: {
      category: "Semantic Tableaux",
      definition: "Branching Implication: From P => Q, branch into !P and Q",
    },
    not_imp_nb: {
      category: "Semantic Tableaux",
      definition:
        "Non-branching Not-Implication: From !(P => Q), derive P and !Q",
    },
    not_not_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching Double Negation: From !!P, derive P",
    },
    iff_br: {
      category: "Semantic Tableaux",
      definition:
        "Branching Biconditional: From P <=> Q, branch into (P & Q) and (!P & !Q)",
    },
    not_iff_br: {
      category: "Semantic Tableaux",
      definition:
        "Branching Not-Biconditional: From !(P <=> Q), branch into (P & !Q) and (!P & Q)",
    },
    forall_nb: {
      category: "Semantic Tableaux",
      definition:
        "Non-branching Universal: From forall x. P(x), derive P[t/x] for any term t",
    },
    not_forall_nb: {
      category: "Semantic Tableaux",
      definition:
        "Non-branching Not-Universal: From ! forall x. P(x), derive exists x. !P(x)",
    },
    exists_nb: {
      category: "Semantic Tableaux",
      definition:
        "Non-branching Existential: From exists x. P(x), derive P[c/x] for fresh constant c",
    },
    not_exists_nb: {
      category: "Semantic Tableaux",
      definition:
        "Non-branching Not-Existential: From ! exists x. P(x), derive forall x. !P(x)",
    },
    closed: {
      category: "Semantic Tableaux",
      definition:
        "Closed Branch: Mark a branch as closed when it contains P and !P",
    },

    // Transformational Proof
    comm_assoc: {
      category: "Propositional Logic (Transformational Proof)",
      definition:
        "Commutativity and Associativity: P & Q <-> Q & P, (P & Q) & R <-> P & (Q & R)",
    },
    contr: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Contradiction: P & !P <-> false, P | !P <-> true",
    },
    lem: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Law of the Exclude Middle: P | !P <-> true",
    },
    impl: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Implication: P => Q <-> !P | Q",
    },
    contrapos: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Contrapositive: P => Q <-> !Q => !P",
    },
    simp1: {
      category: "Propositional/Predicate Logic (Transformational Proof)",
      definition:
        "Simplification 1: P & true <-> P, P | false <-> P, forall x. true <-> true, forall x. false <-> false",
    },
    distr: {
      category: "Propositional Logic (Transformational Proof)",
      definition:
        "Distributive Laws: P | (Q & R) <-> (P | Q) & (P | R), P & (Q | R) <-> (P & Q) | (P & R)",
    },
    dm: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "De Morgan's Laws: !(P & Q) <-> !P | !Q, !(P | Q) <-> !P & !Q",
    },
    neg: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Negation: !!P <-> P",
    },
    equiv: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Equivalence: P <=> Q <-> (P => Q) & (Q => P)",
    },
    idemp: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Idempotent Laws: P | P <-> P, P & P <-> P",
    },
    simp2: {
      category: "Propositional Logic (Transformational Proof)",
      definition: "Simplification 2: P | (P & Q) <-> P, P & (P | Q) <-> P",
    },

    // Predicate Logic (Transformational Proofs)
    forall_over_and: {
      category: "Predicate Logic (Transformational Proof)",
      definition:
        "Universal over Conjunction: forall x. (P(x) & Q(x)) <-> (forall x. P(x)) & (forall x. Q(x))",
    },
    exists_over_or: {
      category: "Predicate Logic (Transformational Proof)",
      definition:
        "Existential over Disjunction: exists x. (P(x) | Q(x)) <-> (exists x. P(x)) | (exists x. Q(x))",
    },
    swap_vars: {
      category: "Predicate Logic (Transformational Proof)",
      definition:
        "Variable Swap: forall x, y . P(x,y) <-> forall y, x. P(x,y), exists x, y P(x,y) <-> exists y, x. P(x,y)",
    },
    move_exists: {
      category: "Predicate Logic (Transformational Proof)",
      definition:
        "Move Existential: exists x. P & Q(x) <-> P & exists x. Q(x), exists x. P | Q(x) <-> P | exists x. Q(x)",
    },
    move_forall: {
      category: "Predicate Logic (Transformational Proof)",
      definition:
        "Move Universal:   forall x. Q & P(x) <-> Q & forall x. P(x), forall x. Q | P(x) <-> Q | forall x. P(x)",
    },

    // Equality and Arithmetic
    eq_i: {
      category: "Equality and Arithmetic (Natural Deduction)",
      definition: "Equality Introduction: Derive t = t for any term t",
    },
    eq_e: {
      category: "Equality and Arithmetic (Natural Deduction)",
      definition:
        "Equality Elimination: From t₁ = t₂ and P[t₁/x], derive P[t₂/x]",
    },
    arith: {
      category: "Equality and Arithmetic  (Natural Deduction)",
      definition: "Arithmetic: Apply basic arithmetic operations and properties",
    },
    // Set Theory
    set: {
      category: "Set Theory  (Natural Deduction, Transformational Proof)",
      definition: "Set Theory: Apply basic set theory operations and properties",
    },

    Delta: {
      category: "Z",
      definition:
        "Delta: Used in Z specifications for before-after state operations",
    },
    Xi: {
      category: "Z",
      definition:
        "Xi: Used in Z specifications to indicate no change in state in an operation",
    },
  };
