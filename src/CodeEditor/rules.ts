interface RuleDefinition {
    category: string;
    definition: string;
  }
  
  export const ruleDefinitions: Record<string, RuleDefinition> = {
    // Propositional Logic - Natural Deduction
    and_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Conjunction Introduction: From P and Q, derive P ∧ Q",
    },
    and_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Conjunction Elimination: From P ∧ Q, derive P or Q",
    },
    or_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Disjunction Introduction: From P, derive P ∨ Q (or from Q, derive P ∨ Q)",
    },
    or_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Disjunction Elimination: From P ∨ Q and both P ⊢ R and Q ⊢ R, derive R",
    },
    imp_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Implication Introduction: If assuming P derives Q, then derive P → Q",
    },
    imp_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Implication Elimination: From P and P → Q, derive Q (Modus Ponens)",
    },
    not_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Negation Elimination: From P and ¬P, derive any conclusion",
    },
    not_not_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Double Negation Introduction: From P, derive ¬¬P",
    },
    not_not_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Double Negation Elimination: From ¬¬P, derive P",
    },
    iff_i: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Biconditional Introduction: From P → Q and Q → P, derive P ↔ Q",
    },
    iff_e: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Biconditional Elimination: From P ↔ Q, derive P → Q and Q → P",
    },
    iff_mp: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Biconditional Modus Ponens: From P ↔ Q and P, derive Q (or from Q, derive P)",
    },
    raa: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Reductio Ad Absurdum: If assuming ¬P leads to a contradiction, derive P",
    },
    cases: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Proof by Cases: If P ∨ Q and both P ⊢ R and Q ⊢ R, then derive R",
    },
    case: {
      category: "Propositional Logic (Natural Deduction)",
      definition:
        "Case Analysis: Used within a proof by cases to handle each case",
    },
    assume: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Assumption: Temporarily assume a formula for a sub-proof",
    },
    premise: {
      category: "Propositional Logic (Natural Deduction)",
      definition: "Premise: State a given assumption or hypothesis",
    },
  
    // Predicate Logic - Natural Deduction
    forall_i: {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Universal Introduction: If P(x) is proven for arbitrary x, derive ∀x P(x)",
    },
    forall_e: {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Universal Elimination: From ∀x P(x), derive P[t/x] for any term t",
    },
    exists_i: {
      category: "Predicate Logic (Natural Deduction)",
      definition: "Existential Introduction: From P[t/x], derive ∃x P(x)",
    },
    exists_e: {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Existential Elimination: From ∃x P(x), assume P(c) for fresh c to derive conclusion",
    },
    "for every": {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Universal Instantiation Block: Begin a block to reason about an arbitrary value",
    },
    "for some": {
      category: "Predicate Logic (Natural Deduction)",
      definition:
        "Existential Instantiation Block: Begin a block to reason about a witness",
    },
  
    // Semantic Tableaux Rules
    and_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching And: From P ∧ Q, derive both P and Q",
    },
    not_and_br: {
      category: "Semantic Tableaux",
      definition: "Branching Not-And: From ¬(P ∧ Q), branch into ¬P and ¬Q",
    },
    or_br: {
      category: "Semantic Tableaux",
      definition: "Branching Or: From P ∨ Q, branch into P and Q",
    },
    not_or_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching Not-Or: From ¬(P ∨ Q), derive both ¬P and ¬Q",
    },
    imp_br: {
      category: "Semantic Tableaux",
      definition: "Branching Implication: From P → Q, branch into ¬P and Q",
    },
    not_imp_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching Not-Implication: From ¬(P → Q), derive P and ¬Q",
    },
    not_not_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching Double Negation: From ¬¬P, derive P",
    },
    iff_br: {
      category: "Semantic Tableaux",
      definition:
        "Branching Biconditional: From P ↔ Q, branch into (P ∧ Q) and (¬P ∧ ¬Q)",
    },
    not_iff_br: {
      category: "Semantic Tableaux",
      definition:
        "Branching Not-Biconditional: From ¬(P ↔ Q), branch into (P ∧ ¬Q) and (¬P ∧ Q)",
    },
    forall_nb: {
      category: "Semantic Tableaux",
      definition:
        "Non-branching Universal: From ∀x P(x), derive P[t/x] for any term t",
    },
    not_forall_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching Not-Universal: From ¬∀x P(x), derive ∃x ¬P(x)",
    },
    exists_nb: {
      category: "Semantic Tableaux",
      definition:
        "Non-branching Existential: From ∃x P(x), derive P[c/x] for fresh constant c",
    },
    not_exists_nb: {
      category: "Semantic Tableaux",
      definition: "Non-branching Not-Existential: From ¬∃x P(x), derive ∀x ¬P(x)",
    },
    closed: {
      category: "Semantic Tableaux",
      definition:
        "Closed Branch: Mark a branch as closed when it contains P and ¬P",
    },
  
    // Transformational Rules
    comm_assoc: {
      category: "Transformational Rules",
      definition:
        "Commutativity and Associativity: P ∧ Q ⟺ Q ∧ P, (P ∧ Q) ∧ R ⟺ P ∧ (Q ∧ R)",
    },
    contr: {
      category: "Transformational Rules",
      definition: "Contradiction: P ∧ ¬P ⟺ false, P ∨ ¬P ⟺ true",
    },
    impl: {
      category: "Transformational Rules",
      definition: "Implication: P → Q ⟺ ¬P ∨ Q",
    },
    contrapos: {
      category: "Transformational Rules",
      definition: "Contrapositive: P → Q ⟺ ¬Q → ¬P",
    },
    simp1: {
      category: "Transformational Rules",
      definition: "Simplification 1: P ∧ true ⟺ P, P ∨ false ⟺ P",
    },
    simp2: {
      category: "Transformational Rules",
      definition: "Simplification 2: P ∧ false ⟺ false, P ∨ true ⟺ true",
    },
    distr: {
      category: "Transformational Rules",
      definition:
        "Distributive Laws: P ∨ (Q ∧ R) ⟺ (P ∨ Q) ∧ (P ∨ R), P ∧ (Q ∨ R) ⟺ (P ∧ Q) ∨ (P ∧ R)",
    },
    dm: {
      category: "Transformational Rules",
      definition: "De Morgan's Laws: ¬(P ∧ Q) ⟺ ¬P ∨ ¬Q, ¬(P ∨ Q) ⟺ ¬P ∧ ¬Q",
    },
    neg: {
      category: "Transformational Rules",
      definition: "Double Negation: ¬¬P ⟺ P",
    },
    equiv: {
      category: "Transformational Rules",
      definition: "Equivalence: P ↔ Q ⟺ (P → Q) ∧ (Q → P)",
    },
    idemp: {
      category: "Transformational Rules",
      definition: "Idempotent Laws: P ∨ P ⟺ P, P ∧ P ⟺ P",
    },
  
    // Predicate Logic Transformations
    forall_over_and: {
      category: "Predicate Logic Transformations",
      definition:
        "Universal over Conjunction: ∀x (P(x) ∧ Q(x)) ⟺ ∀x P(x) ∧ ∀x Q(x)",
    },
    exists_over_or: {
      category: "Predicate Logic Transformations",
      definition:
        "Existential over Disjunction: ∃x (P(x) ∨ Q(x)) ⟺ ∃x P(x) ∨ ∃x Q(x)",
    },
    swap_vars: {
      category: "Predicate Logic Transformations",
      definition:
        "Variable Swap: ∀x ∀y P(x,y) ⟺ ∀y ∀x P(x,y), ∃x ∃y P(x,y) ⟺ ∃y ∃x P(x,y)",
    },
    move_exists: {
      category: "Predicate Logic Transformations",
      definition:
        "Move Existential: (∃x P(x)) ∧ Q ⟺ ∃x (P(x) ∧ Q) where x not free in Q",
    },
    move_forall: {
      category: "Predicate Logic Transformations",
      definition:
        "Move Universal: (∀x P(x)) ∧ Q ⟺ ∀x (P(x) ∧ Q) where x not free in Q",
    },
  
    // Equality and Arithmetic
    eq_i: {
      category: "Equality and Arithmetic",
      definition: "Equality Introduction: Derive t = t for any term t",
    },
    eq_e: {
      category: "Equality and Arithmetic",
      definition:
        "Equality Elimination: From t₁ = t₂ and P[t₁/x], derive P[t₂/x]",
    },
    arith: {
      category: "Equality and Arithmetic",
      definition: "Arithmetic: Apply basic arithmetic operations and properties",
    },
    Delta: {
      category: "Equality and Arithmetic",
      definition:
        "Delta Rule: Used in Z specifications for before-after state relations",
    },
    Xi: {
      category: "Equality and Arithmetic",
      definition:
        "Xi Rule: Used in Z specifications to indicate no change in state",
    },
  
    // Set Theory
    set: {
      category: "Set Theory",
      definition: "Set Theory: Apply basic set theory operations and properties",
    },
    disprove: {
      category: "Proof Techniques",
      definition:
        "Disprove: Begin a proof by contradiction to disprove a statement",
    },
  };