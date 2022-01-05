import generateState from "./game.js";

const tx = document.querySelector("textarea");
const btns = document.querySelectorAll("button");
btns.forEach((b, idx) => b.addEventListener("click", () => handleCmd(idx + 1)));

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

let hold = Array(10).fill(false);

function handleKeydown(e){
    if(!e.code.startsWith("Digit")) return;
    
    const n = parseInt(e.code[5]);
    if(!hold[n]){
        handleCmd(n);
        hold[n] = true;
    }
}

function handleKeyup(e){
    if(e.code.startsWith("Digit")) hold[e.code[5]] = false;
}

function print(msg){
	tx.innerHTML += msg;
	tx.scrollTop = tx.scrollHeight;
}

function println(msg){ print((tx.innerHTML === "" ? "" : "\n") + msg); }

const state = generateState();
let options = 1;
handleCmd();

function handleCmd(n){
	if(n > options) return;
	
	const next = state.next(n).value;
	options = next.length - 1;
	println(next[0]);
	for(let i = 1; i < next.length; ++i)
		println(i + ") " + next[i]);
	
    btns.forEach((b, idx) => b.hidden = options < idx + 1);
}