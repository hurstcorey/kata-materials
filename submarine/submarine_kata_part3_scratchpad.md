parse scanner data

const scanner_date
parse X,Y
x = horizontal
y = dep

sub position = horizontal=8, depth=17

  "(8,17)": [
    "-",
    "+",
    "*",
    ".",
    "#",
    "=",
    "%",
    ".",
    ":"
  ],

expected value
x = 8
y = 17

-+*
.#=
%.:



as sub moves check scanner data for matching position (horizontal,depth) from scanner json and save response.
print out map
if there is not a character return space instead


