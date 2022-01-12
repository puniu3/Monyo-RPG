import gears from "./gears.js";
export {round, rnd, attack, pickRnd, sum, multiplier, maxHp, xpTable, level, gearEffects, gear, describe, wear, stats, label, weaponDmg, loot, tryPush, player};

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
const gearEffects = map => [...map.values()].map(gearEffect).flat();

const weaponDmg = map => map.has("primary") ? gear(map.get("primary")).damage : [1, 4, 2];

const gear = name => gears.find(g => g.name === name);

const describeEffect = e => label(e.type) + (e.amount >= 0 ? "+" : "") + (e.amount * 100) + "%" + (e.duration ? `(${e.duration}ターン)` : "");
const name2Effect = name => gear(name).effects.map(describeEffect).reduce((a, b) => a + " " + b, "");
const name2Dmg = name => gear(name).damage ? `こうげきりょく：${gear(name).damage[0] * gear(name).damage[2]}-${gear(name).damage[1] * gear(name).damage[2]}` : "";
const name2OnDodge = name => gear(name).dodge ? ` かいひじ：${gear(name).dodge.map(describeEffect)}` : "";
const describe = name => label(name) + " " + name2Dmg(name) + name2Effect(name) + name2OnDodge(name);

const wear = effects => effects.map(e => ({...e, duration: e.duration - 1})).filter(({duration}) => duration > 0);

const stats = pl =>{
    const hp = `たいりょく：${pl.hp}/${maxHp(pl)}`;
    const dm = multiplier(pl.effects, "damage");
    const damage = dm === 1 ? "" : `\nこうげきりょく：${Math.round(dm * 100)}%`;
    const s = multiplier(pl.effects, "spell");
    const spell = s === 1 ? "" : `\nじゅついりょく：${Math.round(s * 100)}%`;
    const d = sum(pl.effects, "dodge");
    const dodge = d === 0 ? "" : `\nかいひ：${Math.round(d * 100)}%`;
    return hp + damage + spell + dodge;
}

const label = word => {
    const dict = new Map([
        ["primary", "みぎて"],
        ["secondary", "ひだりて"],
        ["head", "あたま"],
        ["body", "からだ"],
        ["feet", "あし"],
        ["hp", "たいりょく"],
        ["dodge", "かいひ"],
        ["spell", "じゅついりょく"],
        ["damage", "こうげきりょく"]]);
    return dict.get(word) || (gear(word) ? gear(word).label : "");
}

const loot = () => pickRnd(gears);

const tryPush = (arr, item) => {if(item !== undefined) arr.push(item);}

const player = (xp, equipment) =>{
    const pl ={
        maxHp: level(xp) + 9,
        effects: gearEffects(equipment),
        damage: weaponDmg(equipment),
        onDodge: [...equipment.values()].map(gear).filter(e => e.dodge).map(e => e.dodge).flat(),
    };
        pl.hp = maxHp(pl);
        return pl;
}