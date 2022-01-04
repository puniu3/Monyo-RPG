export default function*(){
    let pl = {
        maxHp: 10,
        hp: 10,
        blows: 2,
        attack: [1, 4],
        effects:[{type: "dodge", amount: 0.1, duration: Infinity}],
    };
    
    let kills = 0;
    
    while(true){
        let enemy = {...orc, effects:[]};
        yield [enemy.name + "がおそってきた！", "たたかう"];
        
        while(true){
            pl.effects = pl.effects.map(e => ({...e, duration: e.duration - 1})).filter(({duration}) => duration > 0);
            
            let cmd = yield [`たいりょく：${pl.hp}/${maxHp(pl)}\nじゅついりょく：${multiplier(pl.effects, "spell") * 100}%\nてき：${enemy.name}`, "なぐる", "かいふく", "いなずま", "ぼうぎょ"];
            if(cmd === 1){
                const dmg = attack(...pl.attack, pl.blows);
                enemy.hp -= dmg;
                yield [`ぽかっすかっ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.name + "はうごかなくなった！"}`, "つづける"];
            }else if(cmd === 2){
                const rst = round(rnd(3, 8) * multiplier(pl.effects, "spell"));
                pl.hp = Math.min(maxHp(pl), pl.hp + rst);
                pl.effects.push({type: "spell", amount: -0.25, duration: 3});
                pl.effects.push({type: "hp", amount: -0.04, duration: Infinity});
                yield [`いたいのとんでけ！${rst}のたいりょくをかいふく！`, "つづける"];
            }else if(cmd === 3){
                const dmg = round(5 * multiplier(pl.effects, "spell"));
                enemy.hp -= dmg;
                pl.effects.push({type: "spell", amount: -0.25, duration: 3});
                yield [`ニンポをつかうぞ！${dmg}のダメージ！${enemy.hp > 0 ? "" : enemy.name + "はうごかなくなった！"}`, "つづける"];
            }else if(cmd === 4){
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
        
        yield ["たたかいはおわった！", "さらにたたかう"];
        ++kills;
        pl.hp = Math.min(maxHp(pl), pl.hp + round(maxHp(pl) * 0.25));
        pl.effects = pl.effects.map(e => ({...e, duration: e.duration - 1})).filter(({duration}) => duration > 0);
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