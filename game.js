export default function*(){
    let xp = 0;
    let armory = ["plate", "robe"];
    let equipment = ["leather"];
    
    while(true){
        let pl = {
            maxHp: level(xp) + 9,
            hp: level(xp) + 9,
            blows: 2,
            attack: [1, 4],
            effects: gearEffects(equipment),
            skills:["なぐる", "かいふく", "いなずま", "ぼうぎょ"]
        };
        
        let kills = 0;
        
        while(true){
            let enemy = {...orc, effects:[]};
            yield [enemy.name + "がおそってきた！", "たたかう"];
            
            while(true){
                pl.effects = pl.effects.map(e => ({...e, duration: e.duration - 1})).filter(({duration}) => duration > 0);
                
                let cmd = yield [`たいりょく：${pl.hp}/${maxHp(pl)}\nじゅついりょく：${multiplier(pl.effects, "spell") * 100}%\nてき：${enemy.name}`, ...pl.skills];
                const act = pl.skills[cmd - 1];
                if(act === "なぐる"){
                    const dmg = attack(...pl.attack, pl.blows);
                    enemy.hp -= dmg;
                    yield [`ぽかっすかっ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.name + "はうごかなくなった！"}`, "つづける"];
                }else if(act === "かいふく"){
                    const rst = round(rnd(3, 8) * multiplier(pl.effects, "spell"));
                    pl.hp = Math.min(maxHp(pl), pl.hp + rst);
                    pl.effects.push({type: "spell", amount: -0.25, duration: 3},{type: "hp", amount: -0.04, duration: Infinity});
                    yield [`いたいのとんでけ！${rst}のたいりょくをかいふく！`, "つづける"];
                }else if(act === "いなずま"){
                    const dmg = round(5 * multiplier(pl.effects, "spell"));
                    enemy.hp -= dmg;
                    pl.effects.push({type: "spell", amount: -0.25, duration: 3});
                    yield [`ニンポをつかうぞ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.name + "はうごかなくなった！"}`, "つづける"];
                }else if(act === "ぼうぎょ"){
                    pl.effects.push({type: "dodge", amount: 0.5, duration: 2});
                    yield ["みがまえて こうげきをかわしやすくなった！", "つづける"];
                }
                if(enemy.hp <= 0) break;
                
                const dmg = pickRnd(enemy.damage);
                if(Math.random() > sum(pl.effects, "dodge", 0.85)){
                    pl.hp -= dmg;
                    yield [`がすっ！${dmg}のダメージをうけた！${pl.hp > 0 ? "" : "やられてしまった！"}`, "つづける"];
                }else{
                    yield [`ひらり！こうげきをかわした！`, "つづける"];
                }
                if(pl.hp <= 0) break;
            }
            
            if(pl.hp <= 0) return [`しんでしまった.. たおしたてき：${kills}`];
            
            ++kills;        
            const cmd = yield ["たたかいはおわった！", "すすむ", "もどる"];
            if(cmd === 2) break;
            
            pl.hp = Math.min(maxHp(pl), pl.hp + round(maxHp(pl) * 0.25));
            pl.effects = pl.effects.map(e => ({...e, duration: e.duration - 1})).filter(({duration}) => duration > 0);
        }
        
        const xpGained = xpTable[kills] || xpTable[xpTable.length - 1];
        yield [`ぶじにかえってきた..\n${kills}たいのてきをたおし ${xpGained}のけいけんをえた${level(xp) < level(xp + xpGained) ? "\nレベルがあがった！" : ""}`, "つづける"];
        xp += xpGained;
        
        let cmd;
        while(cmd !== 1){
            cmd = yield [`レベル：${level(xp)}`, "もぐる", "そうび"];
            
            if(cmd === 2){
                const eqp = yield [`どれをそうび？`, "E" + name2Desc(equipment[0]), ...armory.map(name2Desc)];
                if(eqp !== 1){armory.push(equipment.pop()); equipment.push(...armory.splice(eqp - 2, 1));}
            }
        }
    }
}

const round = n => Math.random() < (n - Math.floor(n)) ? Math.ceil(n) : Math.floor(n);

const rnd = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

const attack = (min, max, blows) => Array(blows).fill(0).map(_ => rnd(min, max)).reduce((a, b) => a + b);

const pickRnd = arr => arr[Math.random() * arr.length | 0];

const sum = (effects, type, ceil) => {
    const subtotal = effects.filter(e => e.type === type).map(e => e.amount).reduce((a, b) => a + b, 0);
    return ceil === undefined ? subtotal : Math.min(ceil, subtotal);
}
const multiplier = (effects, type, ceil) => sum(effects, type, ceil) + 1;

const maxHp = pl => Math.ceil(pl.maxHp * multiplier(pl.effects, "hp"));

const orc = {
    name: "くさそうなオーク",
    hp: 12,
    damage: [6, 3, 2, 2]
};

const xpTable = [0, 1, 2, 4, 6, 10, 12, 14, 15];
const lvTable = [0, 3, 10, 20, 38];
const level = xp => lvTable.filter(req => req <= xp).length;

const gears = [
    {name: "leather", label: "かわよろい", effect: {type: "dodge", amount: 0.1}},
    {name: "plate", label: "むねあて", effect: {type: "hp", amount: 0.2}},
    {name: "robe", label: "ローブ", effect: {type: "spell", amount: 0.25}}
];

const gearEffect = name => ({...gears.find(g => g.name === name).effect, duration: Infinity});
const gearEffects = names => names.map(gearEffect);

const name2Label = name => gears.find(g => g.name === name).label;
const name2Effect = name => {
    const dict = new Map([["hp", "たいりょく"], ["dodge", "かいひ"], ["spell", "じゅついりょく"]]);
    const e = gears.find(g => g.name === name).effect;
    return dict.get(e.type) + (e.amount >= 0 ? "+" : "-") + (e.amount * 100) + "%";
};
const name2Desc = name => name2Label(name) + " " + name2Effect(name);