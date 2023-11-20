# Notes

[📕 Read More at fountain.io](https://fountain.io/syntax#notes)

A Note is created by enclosing some text with double brackets. Notes can be inserted between lines, or in the middle of a line.

```fountain
INT. TRAILER HOME - DAY

This is the home of THE BOY BAND, AKA DAN and JACK[[Or did we think of actual names for these guys?]]. They too are drinking beer, and counting the take from their last smash-and-grab. Money, drugs, and ridiculous props are strewn about the table.

[[It was supposed to be Vietnamese, right?]]

JACK
(in Vietnamese, subtitled)
*Did you know Brick and Steel are retired?*
```

The empty lines around the Note on its own line would be removed in parsing.

Notes can contain carriage returns, but if you wish a note to contain an empty line, you must place two spaces there to “connect” the element into one.

```fountain
His hand is an inch from the receiver when the phone RINGS. Scott pauses for a moment, suspicious for some reason.[[This section needs work.
Either that, or I need coffee.
⎵⎵
Definitely coffee.]] He looks around. Phone ringing.
```

Notes are designed to be compatible with the types of inserted annotation common in screenwriting software, e.g. Final Draft’s Scriptnotes. To hide, or “comment out” sections of text, use the [boneyard](https://fountain.io/syntax#boneyard) syntax.
