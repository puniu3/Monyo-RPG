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

const weaponDmg = map => map.has("primary") ? gear(map.get("primary")).damage : [1, 4];

const gear = name => gears.find(g => g.name === name);

const name2Label = name => gears.find(g => g.name === name).label;
const name2Effect = name => {
    const dict = new Map([["hp", "たいりょく"], ["dodge", "かいひ"], ["spell", "じゅついりょく"]]);
    const es = gears.find(g => g.name === name).effects;
    return es.map(e => dict.get(e.type) + (e.amount >= 0 ? "+" : "") + (e.amount * 100) + "%").reduce((a, b) => a + " " + b, ""); 
};
const name2Dmg = name => gear(name).damage ? `こうげきりょく：${gear(name).damage[0]}-${gear(name).damage[1]}` : "";
const describe = name => name2Label(name) + " " + name2Dmg(name) + name2Effect(name);

const wear = effects => effects.map(e => ({...e, duration: e.duration - 1})).filter(({duration}) => duration > 0);

const stats = pl => `たいりょく：${pl.hp}/${maxHp(pl)}\nじゅついりょく：${Math.round(multiplier(pl.effects, "spell") * 100)}%`;

const label = type => {
    const dict = new Map([["primary", "みぎて"], ["secondary", "ひだりて"], ["head", "あたま"], ["body", "からだ"], ["feet", "あし"]]);
    return dict.get(type);
}

const loot = () => pickRnd(gears);

const tryPush = (arr, item) => {if(item !== undefined) arr.push(item);}

const player = (xp, equipment) =>{
    const pl ={
        maxHp: level(xp) + 9,
        effects: gearEffects(equipment),
        damage: weaponDmg(equipment),
        skills:["なぐる", "かいふく", "いなずま", "ぼうぎょ"]
    };
        pl.hp = maxHp(pl);
        return pl;
}