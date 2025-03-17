# API Documentation

## Overview
These API endpoints call the George Backend

## Base URL
https://student.cs.uwaterloo.ca/~se212/

## Endpoints
#### Check George
- **Endpoint**: `POST /language-server/custom/getFeedback`
- **Description**: "Ask George" check.
- **Parameters**:
  - `valueToVerify` (plain text): Full .grg file as plain text.
- **Response**:
  - Feedback of checking George as plain text.

#### Get File Directories
- **Endpoint**: `GET /files.json`
- **Description**: Returns the SE212 file directories.
- **Parameters**: None
- **Response**:
  - The file directory and the names in this example: [GitHub Directory Example](https://github.com/michelleshx/Boole/blob/master/src/common/directories.js).

#### Get Zspec Components
- **Endpoint**: `POST /language-server/custom/getZSpecComponents`
- **Description**: Parses the initial .grg file (#check Z) to get the state space, types, and constants.
- **Parameters**:
  - `valueToVerify` (plain text): Full .grg file as plain text.
- **Response** (JSON):
  ```json
    {
        "components": {
            "types": [
            "Chair",
            "Player"
            ],
            "constants": {},
            "schemas": [
            {
                "name": "MusicalChairs",
                "type": "DECLARE",
                "declarations": [
                {
                    "name": "chairs",
                    "type": "pow(Chair)",
                    "line": "(14, 14)"
                },
                {
                    "name": "players",
                    "type": "pow(Player)",
                    "line": "(15, 15)"
                },
                {
                    "name": "occupied",
                    "type": "Chair >-|-> Player",
                    "line": "(20, 20)"
                }
                ]
            },
            {
                "name": "Initial",
                "type": "INCLUDE",
                "declarations": []
            },
            {
                "name": "MusicStarts",
                "type": "DELTA",
                "declarations": [
                {
                    "name": "in?",
                    "type": "Inputs",
                    "line": "(48, 48)"
                }
                ]
            },
            {
                "name": "MusicStops",
                "type": "DELTA",
                "declarations": [
                {
                    "name": "in?",
                    "type": "Inputs",
                    "line": "(63, 63)"
                }
                ]
            },
            {
                "name": "EliminatePlayer",
                "type": "DELTA",
                "declarations": [
                {
                    "name": "in?",
                    "type": "Inputs",
                    "line": "(79, 79)"
                },
                {
                    "name": "player_out!",
                    "type": "Player",
                    "line": "(80, 80)"
                }
                ]
            },
            {
                "name": "DeclareWinner",
                "type": "XI",
                "declarations": [
                {
                    "name": "in?",
                    "type": "Inputs",
                    "line": "(96, 96)"
                },
                {
                    "name": "winner!",
                    "type": "Player",
                    "line": "(97, 97)"
                }
                ]
            }
            ]
        },
        "output": ""
    }

#### Run Operations
- **Endpoint**: `POST /language-server/custom/runOperations`
- **Description**: Takes as input the initial .grg file (#check Z), the state, and a operation (and predicates of the operation). Returns the current state space and the results of the predicates
- **Parameters**:
  - `valueToVerify` (plain text): Full .grg file as plain text.
  - `interpretation` (JSON): the state space as JSON
  - `operation` (string): the operation to be ran as a string
- **Response** (JSON):
  ```json
    {
        "components": {
            "chairs": {
            "values": [
                "ch1",
                "ch2",
                "ch3"
            ]
            },
            "players": {
            "values": [
                "p1",
                "p2",
                "p3"
            ]
            },
            "occupied": {
            "values": [
                [
                "ch1",
                "p2"
                ],
                [
                "ch3",
                "p1"
                ]
            ]
            },
            "in?": {
            "values": [
                "MusicStarts"
            ]
            }
        },
        "operation": "occupied"
    }