import gears from "./gears.js";
export {round, rnd, attack, pickRnd, sum, multiplier, maxHp, xpTable, level, gearEffects, name2Desc, wear, stats};

const round = n => Math.random() < (n - Math.floor(n)) ? Math.ceil(n) : Math.floor(n);
const rnd = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;
const pickRnd = arr => arr[Math.random() * arr.length | 0];

const attack = (min, max, blows) => Array(blows).fill(0).map(_ => rnd(min, max)).reduce((a, b) => a + b);

const sum = (effects, type, ceil) => {
    const subtotal = effects.filter(e => e.type === type).map(e => e.amount).reduce((a, b) => a + b, 0);
    return ceil === undefined ? subtotal : Math.min(ceil, subtotal);
}
const multiplier = (effects, type, ceil) => sum(effects, type, ceil) + 1;

const maxHp = pl => Math.ceil(pl.maxHp * multiplier(pl.effects, "hp"));

const xpTable = [0, 1, 2, 4, 6, 10, 12, 14, 15];
const lvTable = [0, 3, 10, 20, 38];
const level = xp => lvTable.filter(req => req <= xp).length;

const gearEffect = name => (gears.find(g => g.name === name).effects.map(e => ({...e, duration: Infinity})));
const gearEffects = names => names.map(gearEffect).flat();

const name2Label = name => gears.find(g => g.name === name).label;
const name2Effect = name => {
    const dict = new Map([["hp", "たいりょく"], ["dodge", "かいひ"], ["spell", "じゅついりょく"]]);
    const es = gears.find(g => g.name === name).effects;
    return es.map(e => dict.get(e.type) + (e.amount >= 0 ? "+" : "") + (e.amount * 100) + "%").reduce((a, b) => a + " " + b, ""); 
};
const name2Desc = name => name2Label(name) + " " + name2Effect(name);

const wear = effects => effects.map(e => ({...e, duration: e.duration - 1})).filter(({duration}) => duration > 0);

const stats = pl => `たいりょく：${pl.hp}/${maxHp(pl)}\nじゅついりょく：${multiplier(pl.effects, "spell") * 100}%`;