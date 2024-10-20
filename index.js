"use strict";
const BOARD_ROWS = 64; // 25px cells
const BOARD_COLS = BOARD_ROWS; // 25px cells
// const stateColors = ["#181818", "#6F73D2", "#DC758F", "#F4E04D"];
function createBoard() {
    const board = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
        board.push(new Array(BOARD_COLS).fill(0));
    }
    return board;
}
const canvasId = "app";
const app = document.getElementById(canvasId);
if (app === null) {
    throw new Error(`Couldn't find canvas: ${canvasId}`);
}
app.width = 800;
app.height = 800;
const ctx = app.getContext("2d");
if (ctx === null) {
    throw new Error(`Couldn't initialise 2-dimensional context.`);
}
const nextId = "next";
const nextBtn = document.getElementById(nextId);
if (nextBtn == null) {
    throw new Error(`Couldn't find button: ${nextId}`);
}
const CELL_WIDTH = app.width / BOARD_COLS;
const CELL_HEIGHT = app.height / BOARD_ROWS;
let curBoard = createBoard();
let nxtBoard = createBoard();
function mod(a, b) {
    return (a % b + b) % b;
}
function countNbors(board, nbors, r0, c0) {
    nbors.fill(0);
    for (let dr = -1; dr <= 1; ++dr) {
        for (let dc = -1; dc <= 1; ++dc) {
            if (dr != 0 || dc != 0) {
                const r = mod(r0 + dr, BOARD_ROWS);
                const c = mod(c0 + dc, BOARD_COLS);
                nbors[board[r][c]]++;
            }
        }
    }
}
;
const GoL = [
    {
        "transition": {
            "53": 1,
        },
        "default": 0,
        "color": "#181818",
    },
    {
        "transition": {
            "62": 1,
            "53": 1,
        },
        "default": 0,
        "color": "#6F73D2",
    },
];
const Seeds = [
    {
        "transition": {
            "62": 1,
        },
        "default": 0,
        "color": "#181818",
    },
    {
        "transition": {},
        "default": 0,
        "color": "#6F73D2",
    },
];
const BB = [
    // 0 DEAD
    {
        "transition": {
            "026": 1,
            "125": 1,
            "224": 1,
            "323": 1,
            "422": 1,
            "521": 1,
            "620": 1,
        },
        "default": 0,
        "color": "#181818",
    },
    // 1 ALIVE
    {
        "transition": {},
        "default": 2,
        "color": "#6F73D2",
    },
    // 2 DYING
    {
        "transition": {},
        "default": 0,
        "color": "#DC758F",
    },
];
function computeNextBoard(automaton, current, next) {
    const DEAD = 0;
    const ALIVE = 1;
    const nbors = new Array(automaton.length).fill(0);
    for (let r = 0; r < BOARD_ROWS; ++r) {
        for (let c = 0; c < BOARD_COLS; ++c) {
            countNbors(current, nbors, r, c);
            const state = automaton[current[r][c]];
            next[r][c] = state.transition[nbors.join("")];
            if (next[r][c] === undefined)
                next[r][c] = state["default"];
        }
    }
}
function render(ctx, automaton, board) {
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, app.width, app.height);
    ctx.fillStyle = "#6F73D2";
    for (let r = 0; r < BOARD_ROWS; ++r) {
        for (let c = 0; c < BOARD_COLS; ++c) {
            const x = c * CELL_WIDTH;
            const y = r * CELL_HEIGHT;
            ctx.fillStyle = automaton[board[r][c]].color;
            ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
        }
    }
}
const curAutomaton = BB;
app.addEventListener("click", (e) => {
    const col = Math.floor(e.offsetX / CELL_WIDTH);
    const row = Math.floor(e.offsetY / CELL_HEIGHT);
    const state = document.getElementsByName("state");
    for (let i = 0; i < state.length; ++i) {
        if (state[i].checked) {
            curBoard[row][col] = i;
            render(ctx, curAutomaton, curBoard);
            return;
        }
    }
});
nextBtn.addEventListener("click", () => {
    computeNextBoard(BB, curBoard, nxtBoard);
    [curBoard, nxtBoard] = [nxtBoard, curBoard];
    render(ctx, curAutomaton, curBoard);
});
render(ctx, curAutomaton, curBoard);
