const example = [
  {
    name: "scratchpad.grg",
    contents: `#u name
#a 00

#q 00

#check PROP

a => b`,
  },
  {
    name: "nd_example.grg",
    contents: `#u name
#a 00
#q 00

#check ND

p => !q, r => q |- p => !r

1) p => !q premise
2) r => q premise
3) assume p {
	4) !q by imp_e on 1, 3
	5) !r by imp_e on 2, 4
}
6) p => !r by imp_i on 3-5`,
  },
  {
    name: "ce_example.grg",
    contents: `#u name
#a 00
#q 00

#check CE

[People] := {Alice, Bob, Charlie}
[Me: People] := Alice
[students: People] := {Alice, Bob, Charlie}
[high_school_students: People] := {Alice, Charlie}
[OperatingSystem] := {Macbook, Linux, Windows, Ubuntu}
[used_in_class: OperatingSystem] := {Macbook, Windows}
[programs: People --> OperatingSystem] := {(Alice, Macbook), (Bob, Ubuntu)}
[likes: People --> OperatingSystem] := {(Alice, Macbook), (Alice, Linux), (Bob, Windows), (Charlie, Ubuntu)}
[needs_update: OperatingSystem --> bool] := {(Macbook, T), (Linux, F), (Ubuntu, F), (Windows, F)}

forall os: OperatingSystem . needs_update(os)`,
  },
];

export default example;
